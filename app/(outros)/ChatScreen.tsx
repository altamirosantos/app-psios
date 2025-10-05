import { supabase } from '@/lib/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const SESSION_KEY = "chatSessionId";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [apelido, setApelido] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Inicializa sessão
  useEffect(() => {
    const initSession = async () => {
      let storedSession = await AsyncStorage.getItem(SESSION_KEY);
      if (!storedSession) {
        storedSession = Date.now().toString();
        await AsyncStorage.setItem(SESSION_KEY, storedSession);
      }
      setSessionId(storedSession);
    };
    initSession();
  }, []);

  // Carrega perfil
  useEffect(() => {
    const carregarPerfil = async () => {
      const { data } = await supabase.auth.getSession();
      const userSession = data?.session?.user;
      if (!userSession) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("apelido")
        .eq("id", userSession.id)
        .single();

      if (error) return;

      setApelido(profile.apelido);
      setUserId(userSession.id);

      // const aiMessage: Message = { id: '1', role: 'assistant', content: `👋 Olá, ${profile.apelido}, Estou aqui para conversar com você.` }
      //setMessages([aiMessage]);
      // updateMensages(aiMessage);
    };
    carregarPerfil();
  }, []);

  // Scroll automático sempre que mensagens mudam
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const saveMessage = async () => {
      if (apelido) {
        const aiMessage: Message = {
          id: '1',
          role: 'assistant',
          content: `👋 Olá, ${apelido}! Estou aqui para conversar com você. Sinta-se à vontade para compartilhar o que quiser`,
        }

        const { data, error } = await supabase.from("chat").insert([
          {
            session_id: sessionId,
            user_id: userId,
            mensagens: [aiMessage]
          },
        ]);
        if (error) console.error("Erro ao salvar mensagem:", error);

        setMessages([
          aiMessage
        ]);


      }
    }
    //saveMessage();
  }, [apelido]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    router.push('/(tabs)/home');
  };

  const updateMensages = async (message: Message) => {
    try {
      const { error } = await supabase.rpc("append_mensagem", {
        p_session_id: sessionId,
        p_user_id: userId,
        p_mensagem: message,
      });

      if (error) console.error("Erro ao salvar mensagem:", error);
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
    }
  }
  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {

      const { data, error } = await supabase.functions.invoke("n8n-webhook-chat-psios", {
        body: { sessionId, message: input, apelido }
      })

      /* const response = await fetch(N8N_ENDPOINT, {
         method: "POST",
         headers: { "Content-Type": "application/json; charset=utf-8" },
         body: JSON.stringify({ sessionId, message: input, apelido }),
       });
       const data = await response.json();*/
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.output || "🤖 Desculpe, não consegui entender.",
      };
      setMessages(prev => [...prev, aiMessage]);
      //updateMensages(aiMessage);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const renderMessage = (msg: Message) => (
    <View style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
      <Text style={[styles.messageText, msg.role === 'user' ? styles.userText : styles.assistantText]}>
        {msg.content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient
        colors={['#9333ea', '#d763f8']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bate-papo com sua assistente PSIOS</Text>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity onPress={() => { }}>
              <Ionicons name={isFavorited ? "star" : "star-outline"} size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Chat + Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map(msg => (
              <View key={msg.id}>{renderMessage(msg)}</View>
            ))}

            {loading && <ActivityIndicator size="small" color="#9333ea" style={{ marginVertical: 10 }} />}
          </ScrollView>

          <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 10 }]}>
            <TextInput
              style={[styles.input, { minHeight: 40, maxHeight: 120 }]}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#aaa"
              value={input}
              onChangeText={setInput}
              multiline
              textAlignVertical="top"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, (loading || !input.trim()) && { backgroundColor: "#ccc" }]}
              onPress={sendMessage}
              disabled={loading || !input.trim()}
            >
              <Feather name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F7FA" },
  header: { paddingBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', width: "70%" },
  headerContent: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 16, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#9333ea', borderBottomRightRadius: 0 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: '#e0e0e0' },
  messageText: { fontSize: 15 },
  userText: { color: '#fff' },
  assistantText: { color: '#333' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    fontSize: 14,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: { backgroundColor: '#9333ea', padding: 12, borderRadius: 30 },
});

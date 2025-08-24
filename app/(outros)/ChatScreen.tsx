import { supabase } from '@/lib/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const N8N_ENDPOINT = "https://n8n.softdados.com/webhook/14b734df-5c2b-440e-979c-31d8af85f261";
const SESSION_KEY = "chatSessionId";



export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `👋 Olá, Estou aqui para conversar com você. Sinta-se à vontade para compartilhar o que quiser` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [apelido, setApelido] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);


  // Carrega ou cria uma sessão ao iniciar
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

  useEffect(() => {
    const carregarPerfil = async () => {
      const { data, error } = await supabase.auth.getSession();
      const userSession = data?.session?.user;
      if (!userSession) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("apelido")
        .eq("id", userSession.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil do usuário:", profileError.message);
        return;
      }

      setApelido(profile.apelido);
      setUserId(userSession.id);
    };

    carregarPerfil();
  }, []);

  useEffect(() => {
    if (apelido) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `👋 Olá, ${apelido}! Estou aqui para conversar com você. Sinta-se à vontade para compartilhar o que quiser`,
        },
      ]);
    }
  }, [apelido]);


  const handleFavorite = async () => {
    if (!sessionId || !apelido) return;

    try {
      if (!isFavorited) {
        const { error } = await supabase
          .from("chat_favoritos")
          .insert([
            {
              session_id: sessionId,
              user_id: userId,
              apelido,
              mensagens: messages, // salva o histórico completo
              created_at: new Date(),
            },
          ]);

        if (error) throw error;

        setIsFavorited(true);
        Alert.alert("✨ Favoritado", "Esta conversa foi salva nos seus favoritos.");
      } else {
        const { error } = await supabase
          .from("chat_favoritos")
          .delete()
          .eq("session_id", sessionId);

        if (error) throw error;

        setIsFavorited(false);
        Alert.alert("🗑 Removido", "Conversa removida dos favoritos.");
      }
    } catch (err) {
      console.error("Erro ao favoritar conversa:", err);
      Alert.alert("Erro", "Não foi possível salvar a conversa.");
    }
  };

  const handleLogout = async () => {
    try {
      // Remove a SESSION_KEY
      await AsyncStorage.removeItem(SESSION_KEY);

      // Redireciona para a home
      router.push('/(tabs)/home');
    } catch (error) {
      console.log('Erro ao sair:', error);
    }
  };
  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(N8N_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          sessionId,
          message: input,
          apelido: apelido
        }),
      });

      const data = await response.json();

      console.log('Resposta da API: ', data);
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.output || "🤖 Desculpe, não consegui entender. Pode repetir?",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "⚠️ Ocorreu um erro ao conectar com a assistente. Tente novamente.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.assistantText,
        ]}
      >
        {item.content}
      </Text>
    </View>
  );

  return (

    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9333ea', '#d763f8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Bate-papo com sua assistente PSIOS
          </Text>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity onPress={handleFavorite}>
              <Ionicons
                name={isFavorited ? "star" : "star-outline"}
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Lista de mensagens */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      {loading && (
        <ActivityIndicator size="small" color="#9333ea" style={{ marginBottom: 10 }} />
      )}

      {/* Campo de input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={[styles.sendButton,
          (loading || !input.trim()) && { backgroundColor: "#ccc" }
          ]} onPress={sendMessage}
            disabled={loading || !input.trim()}>
            <Feather name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  header: { paddingTop: 50, paddingBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', width: "70%" },
  chatContainer: { padding: 16, paddingBottom: 80 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 16, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#9333ea', borderBottomRightRadius: 0 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: '#e0e0e0' },
  messageText: { fontSize: 15 },
  userText: { color: '#fff' },
  assistantText: { color: '#333' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#f2f2f2', fontSize: 14, marginRight: 10 },
  sendButton: { backgroundColor: '#9333ea', padding: 12, borderRadius: 30 },
  headerContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});

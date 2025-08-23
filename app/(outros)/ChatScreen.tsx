import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
    { id: '1', role: 'assistant', content: '👋 Olá! Estou aqui para conversar com você. Como está se sentindo hoje?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

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
          message: input
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
        <Text style={styles.headerTitle}>Bate-papo com sua assistente PSIOS</Text>
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
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
  headerTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
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
});

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const sentimentos = [
  { label: 'Muito Mal', color: '#ef4444', emoji: '😞' },
  { label: 'Mal', color: '#facc15', emoji: '😕' },
  { label: 'Neutro', color: '#22c55e', emoji: '😐' },
  { label: 'Bem', color: '#3b82f6', emoji: '🙂' },
  { label: 'Muito Bem', color: '#8b5cf6', emoji: '😄' },
];

export default function AutoavaliacaoPage() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/logo.png')} // Substitua por sua logo
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Cartão de pergunta */}
        <View style={styles.card}>
          <Text style={styles.title}>💓 Como você se sente hoje?</Text>
          <Text style={styles.subtitle}>
            Sua saúde emocional é prioridade?{'\n'}
            Compartilhe como se sente e avance rumo ao seu bem-estar!
          </Text>

          {/* Emojis */}
          <View style={styles.emojis}>
            {sentimentos.map((item) => (
              <View style={styles.emojiItem} key={item.label}>
                <Text style={[styles.emoji, { borderColor: item.color }]}>
                  {item.emoji}
                </Text>
                <Text style={styles.emojiLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botão próximo */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/passo2')}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    /*backgroundColor: '#D060FF',*/
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  emojis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiItem: {
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 28,
    borderWidth: 2,
    borderRadius: 30,
    padding: 6,
    textAlign: 'center',
  },
  emojiLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 40,
    width: width - 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';



export default function Passo1() {
  const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');
  const router = useRouter();
  const [sentimentoSelecionado, setSentimentoSelecionado] = useState<string | null>(null);


  const sentimentos = [
    { label: 'Muito Mal', color: '#ef4444', emoji: '😞' },
    { label: 'Mal', color: '#facc15', emoji: '😕' },
    { label: 'Neutro', color: '#22c55e', emoji: '😐' },
    { label: 'Bem', color: '#3b82f6', emoji: '🙂' },
    { label: 'Muito Bem', color: '#8b5cf6', emoji: '😄' },
  ];



  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleNext = () => {
    updateForm({ passo01Pergunta1: sentimentoSelecionado ?? '' });
    router.push('/passo2');
  };

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.title, { color: textColor }]}>💓 Como você se sente hoje?</Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Sua saúde emocional é prioridade?{'\n'}
            Compartilhe como se sente e avance rumo ao seu bem-estar!
          </Text>

          <View style={styles.emojis}>
            {sentimentos.map((item) => {
              const selecionado = sentimentoSelecionado === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={styles.emojiItem}
                  onPress={() => setSentimentoSelecionado(item.label)}
                >
                  <Text
                    style={[
                      styles.emoji,
                      {
                        borderColor: item.color,
                        backgroundColor: selecionado ? item.color + '33' : 'transparent',
                        transform: [{ scale: selecionado ? 1.2 : 1 }],
                      },
                    ]}
                  >
                    {item.emoji}
                  </Text>
                  <Text style={styles.emojiLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <CustomButton
          title="Próximo..."
          onPress={handleNext}
          disabled={!sentimentoSelecionado}
        />
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: {
    flex: 1,
    paddingBottom: 50
  },
  container: {
    flex: 1,
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
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 80,
  },
  emojis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    overflow: 'hidden',
  },
  emojiLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFA45E',
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

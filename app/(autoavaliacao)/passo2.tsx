import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useForm } from '@/context/FormContext';

const options = {
  emotions: [
    "Alegria", "Tristeza", "Raiva", "Medo", "Surpresa", "Nojo", "Confiança",
    "Antecipação", "Amor", "Culpa", "Vergonha", "Ansiedade", "Esperança", "Compaixão",
    "Orgulho", "Gratidão", "Sensação de desmaio", "Sensação de bolo na garganta", "Tontura",
    "Suor frio", "Náuseas", "Sufocamento", "Palpitações", "Dor ou pressão no peito",
    "Tremor", "Vazio", "Desesperança", "Sobrecarregado", "Me sentindo estranho(a)"
  ]
};

const FeedbackScreen = () => {
  const router = useRouter();
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const { updateForm } = useForm();

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((item) => item !== emotion)
        : [...prev, emotion]
    );
  };

  const handleNext = () => {
    updateForm({ selectedEmotions: selectedEmotions });
    router.push('/passo3');
  };

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <ScrollView>
        <View style={styles.container}>

          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.card}>
            <Text style={styles.title}>Quais emoções você está sentindo agora?</Text>
            <Text style={styles.subtitle}>Selecione todas as emoções que se aplicam.</Text>

            <View style={styles.tagContainer}>
              {options.emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  style={[
                    styles.tag,
                    selectedEmotions.includes(emotion) && styles.tagSelected
                  ]}
                  onPress={() => toggleEmotion(emotion)}
                >
                  <Text style={selectedEmotions.includes(emotion) ? styles.tagTextSelected : styles.tagText}>
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botão próximo */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedEmotions.length === 0 && { backgroundColor: '#ccc' },
            ]}
            disabled={selectedEmotions.length === 0}
            onPress={handleNext}
          >
            <Text
              style={[
                styles.buttonText,
                selectedEmotions.length === 0 && { color: '#aaa' },
              ]}
            >
              Próximo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default FeedbackScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  containerRoot: {
    flex: 1,
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginVertical: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagSelected: {
    backgroundColor: '#6366f1',
  },
  tagText: {
    color: '#333',
  },
  tagTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#5B3C83',
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

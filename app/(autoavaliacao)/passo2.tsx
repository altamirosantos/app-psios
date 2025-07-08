import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  /*const [selectedReactions, setSelectedReactions] = useState<string[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [trigger, setTrigger] = useState('');
  const [thoughts, setThoughts] = useState('');*/

  const toggleOption = (option: string, setState: React.Dispatch<React.SetStateAction<string[]>>, state: string[]) => {
    if (state.includes(option)) {
      setState(state.filter(item => item !== option));
    } else {
      setState([...state, option]);
    }
  };

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <ScrollView>
        <View style={styles.container}>

          {/* Logo */}
          <Image
            source={require('@/assets/images/logo.png')} // Substitua por sua logo
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
                  onPress={() => toggleOption(emotion, setSelectedEmotions, selectedEmotions)}
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
            style={styles.button}
            onPress={() => router.push('/passo3')}
          >
            <Text style={styles.buttonText}>Próximo</Text>
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
  },
  container: {
    flex: 1,
    /*backgroundColor: '#d946ef',*/
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
    gap: 8,
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
  sliderValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerNote: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    marginBottom: 40,
    paddingHorizontal: 20,
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

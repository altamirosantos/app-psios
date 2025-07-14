import { useForm } from '@/context/FormContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Checkbox } from 'react-native-paper';


const comportamentoOptions = [
  "Fugi", "Evitei", "Paralisei", "Recuei",
  "Não fiz nada", "Me calei", "Andei de um lado para o outro", "Outros"
];

const FeedbackScreen = () => {
  const [oque, setOque] = useState('');
  const [quando, setQuando] = useState('');
  const [comoSeComportou, setComoSeComportou] = useState<string[]>([]);
  const [alguemEnvolvido, setAlguemEnvolvido] = useState('');
  const [gatilho, setGatilho] = useState('');
  const [pensamento, setPensamento] = useState('');

  const { updateForm } = useForm();

  const toggleComportamento = (option: string) => {
    setComoSeComportou(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    updateForm({ passo8Oque: oque, passo8Quando: quando, passo8ComoSeComportou: comoSeComportou, passo8AlguemEnvolvido: alguemEnvolvido, passo8Gatilho: gatilho, passo8Pensamento: pensamento });
    router.push('/passo9');
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
            <Text style={styles.title}>😊 Seu bem-estar é importante! Vamos juntos entender?</Text>
            <Text style={styles.subtitle}>Com base no que você acredita no pensamento que causou essas sensações e sentimentos, preencha abaixo de forma breve e sincera. Isso vai ajudar vocë a entender melhor o que está afetando seu estado emocional.</Text>
            <Text style={styles.title}>📌 Situação</Text>
            <Text style={styles.subtitle}>O que aconteceu?</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={oque}
              onChangeText={setOque}
              multiline
            />
            <Text style={styles.subtitle}>Quando e onde foi?</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={quando}
              onChangeText={setQuando}
              multiline
            />

            <View style={styles.radioContainer}>
              <Text style={styles.subtitle}>Como você se comportou nessa situação?</Text>
              <View style={styles.radioGrid}>
                {comportamentoOptions.map((option, index) => (
                  <View key={index} style={styles.radioItem}>
                    <Checkbox
                      status={comoSeComportou.includes(option) ? 'checked' : 'unchecked'}
                      onPress={() => toggleComportamento(option)}
                    />
                    <Text style={styles.label} onPress={() => toggleComportamento(option)}>
                      {option}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.subtitle}>Alguém esteve envolvido? Quem?</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={alguemEnvolvido}
              onChangeText={setAlguemEnvolvido}
              multiline
            />

            <Text style={styles.title}>⚡ Gatilho</Text>
            <Text style={styles.subtitle}>O que despertou sua emoção? (Pode ter sido uma palavra, cheiro, música, tom de voz ou situação inesperada)</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={gatilho}
              onChangeText={setGatilho}
              multiline
            />

            <Text style={styles.title}>💭 Pensamento</Text>
            <Text style={styles.subtitle}>O que mais mexeu com sua mente? Que imagem ou lembrança surgiu antes da emoção?</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={pensamento}
              onChangeText={setPensamento}
              multiline
            />

          </View>

          {/* Botão próximo */}
          <TouchableOpacity
            style={[
              styles.button,
              (!oque || !quando || comoSeComportou.length === 0 || !alguemEnvolvido || !gatilho || !pensamento) && { backgroundColor: '#ccc' },
            ]}
            disabled={!oque || !quando || comoSeComportou.length === 0 || !alguemEnvolvido || !gatilho || !pensamento}
            onPress={handleNext}
          >
            <Text style={[
              styles.buttonText,
              (!oque || !quando || comoSeComportou.length === 0 || !alguemEnvolvido || !gatilho || !pensamento) && { color: '#aaa' },
            ]}>Me conte mais...</Text>
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
  radioContainer: {
    marginBottom: 16,
  },
  containerRoot: {
    flex: 1,
    paddingBottom: 50
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
    width: '100%', // ocupa 100% da área do container pai
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'left',
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
    color: 'black',
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
  radioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  }
});

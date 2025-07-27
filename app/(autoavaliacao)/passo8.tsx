import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Checkbox } from 'react-native-paper';




const Passo8 = () => {
  const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  const [oque, setOque] = useState('');
  const [sentimento, setSentimento] = useState('');
  const [comoSeComportou, setComoSeComportou] = useState<string[]>([]);
  //const [alguemEnvolvido, setSentimento] = useState('');
  const [gatilho, setGatilho] = useState('');
  const [pensamento, setPensamento] = useState('');


  const comportamentoOptions = [
    "Fugi", "Evitei", "Paralisei", "Recuei",
    "Não fiz nada", "Me calei", "Andei de um lado para o outro", "Outros"
  ];


  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const toggleComportamento = (option: string) => {
    setComoSeComportou(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    updateForm({ passo8Oque: oque, passo8Sentimento: sentimento, passo8ComoSeComportou: comoSeComportou, passo8Gatilho: gatilho, passo8Pensamento: pensamento });
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

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>😊 Seu bem-estar é importante! Vamos juntos entender?</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>Para entender melhor o que afeta seu estado emocional, conte aqui, de forma breve e sincera, uma experiência vívida, que mostra como certos pensamentos e sentimentos impactaram você.</Text>
            <Text style={[styles.title, { color: textColor }]}>📌 Situação</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>O que aconteceu?</Text>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBg }]}
              placeholder=""
              value={oque}
              onChangeText={setOque}
              multiline
            />

            <Text style={[styles.title, { color: textColor }]}>⚡ Gatilho</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>O que despertou sua emoção? (Pode ter sido uma palavra, cheiro, música, tom de voz ou situação inesperada)</Text>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBg }]}
              placeholder=""
              value={gatilho}
              onChangeText={setGatilho}
              multiline
            />

            <Text style={[styles.title, { color: textColor }]}>💭 Pensamento</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>O que mais mexeu com sua mente? Que imagem ou lembrança surgiu antes da emoção?</Text>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBg }]}
              placeholder=""
              value={pensamento}
              onChangeText={setPensamento}
              multiline
            />

            <Text style={[styles.title, { color: textColor }]}>❤️ Sentimento</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>O que você sentiu?</Text>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBg }]}
              placeholder=""
              value={sentimento}
              onChangeText={setSentimento}
              multiline
            />

            <View style={styles.radioContainer}>
              <Text style={[styles.subtitle, { color: textColor }]}>Como você se comportou nessa situação?</Text>
              <View style={styles.radioGrid}>
                {comportamentoOptions.map((option, index) => (
                  <View key={index} style={[styles.radioItem, { backgroundColor: inputBg }]}>
                    <Checkbox
                      status={comoSeComportou.includes(option) ? 'checked' : 'unchecked'}
                      onPress={() => toggleComportamento(option)}
                    />
                    <Text style={[styles.label, { color: textColor }]} onPress={() => toggleComportamento(option)}>
                      {option}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

          </View>

          <CustomButton
            title="Me conte mais..."
            onPress={handleNext}
            disabled={(!oque || comoSeComportou.length === 0 || !sentimento || !gatilho || !pensamento)}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo8;

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

import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image, Platform, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
//import { useForm } from '@/context/FormContext';
import { useThemeColor } from '@/hooks/useThemeColor';


const Passo8 = () => {
  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  const [selecionadoComoCostumaLidar, setSelecionadoComoCostumaLidar] = useState<string | null>(null);
  const [selecionadoPensarFuturo, setSelecionadoPensarFuturo] = useState<string | null>(null);
  const [selecionadoConcentracao, setSelecionadoConcentracao] = useState<string | null>(null);
  const [sliderValuePreparado, setSliderValuePreparado] = useState(5);



  const comoCostumaLidar = [
    'Me expresso com facilidade (converso, escrevo, crio).',
    'Levo um tempo, mas acabo organizando dentro de mim.',
    'Guardo para mim e evito mostrar.',
    'Nem sempre entendo o que estou sentindo.',
  ];

  const pensarFuturo = [
    'Sinto esperança e curiosidade',
    'Fico ansioso(a) ou confuso(a) com o que pode acontecer',
    'Ainda não consigo imaginar como será',
    'Sinto insegurança e dúvidas',
    'Tenho vontade de melhorar e fazer mudanças.',
  ];

  const concentracao = [
    "Me distraio com facilidade e sinto dificuldade para manter o foco.",
    "Consigo me concentrar em algumas atividades, mas me perco com facilidade.",
    "Tenho conseguido manter o foco de forma razoável na maior parte do tempo.",
    "Estou focado(a) e com boa concentração na maioria das atividades.",
    "Estou com foco intenso e concentração plena no que preciso fazer."
  ]

  /*const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }*/

  //const { updateForm } = useForm();
  const handleNext = () => {
    //updateForm({ passo08Pergunta1: selecionadoComoCostumaLidar ?? '', passo08Pergunta2: selecionadoPensarFuturo ?? '', passo08Pergunta3: selecionadoConcentracao ?? '', passo08Pergunta4: sliderValuePreparado.toString() });
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
            <Text style={[styles.title, { color: textColor }]}>❤️ Como você costuma lidar com seus sentimentos?</Text>
            {comoCostumaLidar.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoComoCostumaLidar === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoComoCostumaLidar(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoComoCostumaLidar === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>🌀 Ao imaginar seu futuro, qual dessas frases traduz melhor o que você sente?</Text>
            {pensarFuturo.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoPensarFuturo === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoPensarFuturo(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoPensarFuturo === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>🧠 Como você descreveria sua capacidade de concentração e foco nos últimos dias?</Text>
            {concentracao.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoConcentracao === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoConcentracao(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoConcentracao === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>
              🌟 O quanto você sente que está preparado(a) ou confiante em relação ao seu futuro neste momento?
            </Text>

            {/* Valor acima da barra */}
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderValueText}>{sliderValuePreparado}</Text>
            </View>

            {Platform.OS === 'web' ? (
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={sliderValuePreparado}
                onChange={(e) => setSliderValuePreparado(Number(e.target.value))}
                style={{
                  width: '100%',
                  marginTop: 10,
                  appearance: 'none',
                  height: 6,
                  backgroundColor: '#ddd',
                  borderRadius: 3,
                  outline: 'none',
                }}
              />
            ) : (
              <Slider
                minimumValue={0}
                maximumValue={10}
                value={sliderValuePreparado}
                onValueChange={setSliderValuePreparado}
                step={1}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#4CAF50"
                style={{ marginTop: 10 }}
              />
            )}

            <View style={styles.sliderLabels}>
              <View style={styles.labelContainerLeft}>
                <Text style={[styles.labelValue, { color: textColor }]}>0</Text>
                <Text style={[styles.labelText, { color: textColor }]}>Nada confiante</Text>
              </View>

              <View style={styles.labelContainer}>
                <Text style={[styles.labelValue, { color: textColor }]}>5</Text>
                <Text style={[styles.labelText, { color: textColor }]}>Mais ou menos</Text>
              </View>

              <View style={styles.labelContainerRight}>
                <Text style={[styles.labelValue, { color: textColor }]}>10</Text>
                <Text style={[styles.labelText, { color: textColor }]}>Muito confiante</Text>
              </View>
            </View>
          </View>

          <CustomButton
            title="Próximo..."
            onPress={handleNext}
            disabled={(!selecionadoComoCostumaLidar || !selecionadoPensarFuturo)}
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

  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',

    marginVertical: 8,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,

  },
  opcaoTexto: {
    fontSize: 16,
    color: '#333',
    marginEnd: 20,
  },
  radioCirculo: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelecionado: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#9C27B0',
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
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  sliderValueContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 2,
  },
  sliderValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  labelContainer: {
    alignItems: 'center',
    flex: 1,
  },
  labelContainerLeft: {
    alignItems: 'flex-start',
    flex: 1,
  },
  labelContainerRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  labelValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  labelText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});

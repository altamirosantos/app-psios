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
  TouchableOpacity,
  View
} from 'react-native';

const opCard1 = [
  'Tudo bem, faz parte.',
  'O que posso aprender com isso?',
  'A culpa é minha…',
  'Isso sempre acontece comigo.',
];

const opCard2 = [
  'No que sente.',
  'No que pensa.',
  'No que os outros esperam.',
  'No que faça mais sentido no momento.',
];

const opCard3 = [
  'Ouvir com empatia, mas sem se sobrecarregar.',
  'Tentar agradar e evitar conflitos.',
  'Se proteger e manter certa distância.',
  'Assumir a liderança ou tomar iniciativa.',
];

const opCard4 = [
  'Me animo com o novo e me adapto fácil.',
  'Analiso primeiro, mas topo se fizer sentido.',
  'Sinto receio e prefiro ficar na zona de conforto.',
  'Evite mudanças máximas.',
];

const opCard5 = [
  'Penso demais, fico inseguro(a) e adio a decisão.',
  'Sigo meu impulso ou intuição, sem pensar muito.',
  'Faça listas, compare prós e contras.',
  'Peço conselhos e opiniões antes de decidir.',
  'Confie em mim e escolho o que mais faz sentido na hora.',
];

const opCard6 = [
  'Criatividade.',
  'Persistência.',
  'Foco e organização.',
  'Empatia.',
  'Resiliência.',
  'Capacidade de ouvir.',
];

const FeedbackScreen = () => {
  const [selecionadoOpCard1, setSelecionadoOpCard1] = useState<string | null>(null);
  const [selecionadoOpCard2, setSelecionadoOpCard2] = useState<string | null>(null);
  const [selecionadoOpCard3, setSelecionadoOpCard3] = useState<string | null>(null);
  const [selecionadoOpCard4, setSelecionadoOpCard4] = useState<string | null>(null);
  const [selecionadoOpCard5, setSelecionadoOpCard5] = useState<string | null>(null);
  const [selecionadoOpCard6, setSelecionadoOpCard6] = useState<string | null>(null);

  const { updateForm } = useForm();

  const handleNext = () => {
    updateForm({ passo5Card1: selecionadoOpCard1 ?? '', passo5Card2: selecionadoOpCard2 ?? '', passo5Card3: selecionadoOpCard3 ?? '', passo5Card4: selecionadoOpCard4 ?? '', passo5Card5: selecionadoOpCard5 ?? '', passo5Card6: selecionadoOpCard6 ?? '' });
    router.push('/passo6');
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
            <Text style={styles.title}>🤔 Quando algo dá errado, o que vem primeiro na sua mente?</Text>
            {opCard1.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoOpCard1(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard1 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>✨ Você costuma tomar decisões mais com base:</Text>
            {opCard2.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoOpCard2(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard2 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>👩🏽‍🦱 Quando está com outras pessoas, você tende a:</Text>
            {opCard3.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoOpCard3(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard3 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>🧩 Como você costuma reagir a situações novas ou desconhecidas?</Text>
            {opCard4.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoOpCard4(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard4 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>🟣 Quando você precisa tomar uma decisão importante, como costuma agir?</Text>
            {opCard5.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoOpCard5(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard5 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>🌟 Quando você pensa nas suas qualidades e forças internas, o que mais se destaca em você?</Text>
            {opCard6.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoOpCard6(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard6 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>


          {/* Botão próximo */}
          <TouchableOpacity
            style={[
              styles.button,
              (!selecionadoOpCard1 || !selecionadoOpCard2 || !selecionadoOpCard3 || !selecionadoOpCard4 || !selecionadoOpCard5 || !selecionadoOpCard6) && { backgroundColor: '#ccc' }, // desativado
            ]}
            onPress={handleNext}
            disabled={(!selecionadoOpCard1 || !selecionadoOpCard2 || !selecionadoOpCard3 || !selecionadoOpCard4 || !selecionadoOpCard5 || !selecionadoOpCard6)}
          >
            <Text style={[
              styles.buttonText,
              (!selecionadoOpCard1 || !selecionadoOpCard2 || !selecionadoOpCard3 || !selecionadoOpCard4 || !selecionadoOpCard5 || !selecionadoOpCard6) && { color: '#aaa' },
            ]}
            >Me conte mais...</Text>
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
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
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

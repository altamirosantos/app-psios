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
  TouchableOpacity,
  View
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';



const Passo9 = () => {
  const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  const [selecionadoOpCard1, setSelecionadoOpCard1] = useState<string | null>(null);
  const [selecionadoOpCard2, setSelecionadoOpCard2] = useState<string | null>(null);
  const [selecionadoOpCard3, setSelecionadoOpCard3] = useState<string | null>(null);
  const [selecionadoOpCard4, setSelecionadoOpCard4] = useState<string | null>(null);
  const [selecionadoOpCard5, setSelecionadoOpCard5] = useState<string | null>(null);
  const [selecionadoOpCard6, setSelecionadoOpCard6] = useState<string | null>(null);

  const opCard1 = [
    'Tudo bem, faz parte.',
    'O que posso aprender com isso?',
    'A culpa é minha…',
    'Isso sempre acontece comigo.',
  ];

  const opCard2 = [
    'Tudo parece difícil ou injusto',
    'Vejo altos e baixos, tentando encontrar equilíbrio',
    'Apesar dos desafios, veja beleza e oportunidade',
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
    'Evito mudanças drásticas.',
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


  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleNext = () => {
    updateForm({ passo5Card1: selecionadoOpCard1 ?? '', passo5Card2: selecionadoOpCard2 ?? '', passo5Card3: selecionadoOpCard3 ?? '', passo5Card4: selecionadoOpCard4 ?? '', passo5Card5: selecionadoOpCard5 ?? '', passo5Card6: selecionadoOpCard6 ?? '' });
    router.push('/passo11');
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
            <Text style={[styles.title, { color: textColor }]}>🤔 Em situações difíceis ou frustrantes, o que vem primeiro na sua mente?</Text>
            {opCard1.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard1 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard1(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard1 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>🌍 Como você costuma enxergar o mundo ao seu redor?</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>Seu pensamento contem…</Text>
            {opCard2.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, { backgroundColor: item === selecionadoOpCard2 ? inputBg : 'transparent' }]}
                onPress={() => setSelecionadoOpCard2(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard2 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>👩🏽‍🦱 Em momentos com outras pessoas, você costuma:</Text>
            {opCard3.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard3 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard3(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard3 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>🧩 Como você se sente quando algo novo ou inesperado acontece?</Text>
            {opCard4.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard4 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard4(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard4 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>🟣 Como você costuma reagir diante de decisões importantes?</Text>
            {opCard5.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard5 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard5(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard5 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>🌟 Qual é a força ou qualidade que mais se destaca em você?</Text>
            {opCard6.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard6 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard6(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard6 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton
            title="Me conte mais..."
            onPress={handleNext}
            disabled={(!selecionadoOpCard1 || !selecionadoOpCard2 || !selecionadoOpCard3 || !selecionadoOpCard4 || !selecionadoOpCard5 || !selecionadoOpCard6)}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo9;
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
    marginBottom: 20,
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

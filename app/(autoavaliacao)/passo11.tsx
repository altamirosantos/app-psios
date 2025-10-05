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



const Passo10 = () => {
  const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');
  const [selecionadoPasso11Card1, setSelecionadoPasso11Card1] = useState<string | null>(null);
  const [selecionadoPasso11Card2, setSelecionadoPasso11Card2] = useState<string | null>(null);


  const passo11Card1 = [
    'Está tudo bem, não estar no controle de tudo. Um passo de cada vez já é avanço.',
    'Você não precisa ser perfeito(a) para começar. Só precisa começar do seu jeito.',
    'Errar não te define. O que você define é sua coragem de tentar de novo.',
    'Você merece crescer com gentileza, e não com cobrança.',
    'Toda mudança começa com um gesto pequeno, mas sincero.'
  ];

  const passo11Card2 = [
    'Ter mais pensamentos positivos',
    'Reduzir a ansiedade e o estresse',
    'Me sentir mais confiante',
    'Ter mais equilíbrio nas emoções',
    'Me sentir mais valorizado(a)'
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
    updateForm({ passo11Pergunta1: selecionadoPasso11Card1 ?? '', passo11Pergunta2: selecionadoPasso11Card2 ?? '' });
    router.push('/passoFinaliza');
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
            <Text style={[styles.title, { color: textColor }]}>🌱 Se você pudesse falar com você mesmo(a) com mais carinho hoje, o que você diria para se motivar sem se cobrar tanto?</Text>
          
            {passo11Card1.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, { backgroundColor: item === selecionadoPasso11Card1 ? inputBg : 'transparent' }]}
                onPress={() => setSelecionadoPasso11Card1(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoPasso11Card1 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>💜 Se você pudesse melhorar um aspecto do seu bem-estar emocional agora, qual escolheria?</Text>
            
            {passo11Card2.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, { backgroundColor: item === selecionadoPasso11Card2 ? inputBg : 'transparent' }]}
                onPress={() => setSelecionadoPasso11Card2(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoPasso11Card2 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton
            title="Próximo..."
            onPress={handleNext}
            disabled={!selecionadoPasso11Card1 || !selecionadoPasso11Card2}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo10;
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    marginBottom: 20,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  opcaoTexto: {
    fontSize: 16,
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
});

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
//import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';



const Passo3 = () => {
  //const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');
  const [selecionado, setSelecionado] = useState<string | null>(null);


  const ocupacoes = [
    'Empregado (a)',
    'Autônomo (a)',
    'Dono de casa (a)',
    'Desempregado (a)',
    'Estudante (a)',
    'Aposentado (a)',
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
    //updateForm({ passo03Pergunta1: selecionado ?? '' });
    router.push('/passo4');
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
            <Text style={[styles.title, { color: textColor }]}>💼 Qual é a sua ocupação atualmente?</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>Isso nos ajuda a entender melhor sua rotina e cuidar ainda mais de você.</Text>
            {ocupacoes.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionado === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionado(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionado === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton
            title="Me conte mais..."
            onPress={handleNext}
            disabled={!selecionado}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo3;
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

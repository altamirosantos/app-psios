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

const ocupacoes = [
  'Empregado (a)',
  'Autônomo (a)',
  'Dono de casa (a)',
  'Desempregado (a)',
  'Estudante (a)',
  'Aposentado (a)',
];

const FeedbackScreen = () => {
  const [selecionado, setSelecionado] = useState<string | null>(null);


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
            <Text style={styles.title}>💼 Qual é a sua ocupação atualmente?</Text>
            <Text style={styles.subtitle}>Isso nos ajuda a entender melhor sua rotina e cuidar ainda mais de você.</Text>
            {ocupacoes.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionado(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionado === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botão próximo */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/passo4')}
          >
            <Text style={styles.buttonText}>Me conte mais...</Text>
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

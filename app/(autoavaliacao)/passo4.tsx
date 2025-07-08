import Slider from '@react-native-community/slider';
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

const comoCostumaLidar = [
  'Me expresso com facilidade (converso, escrevo, crio).',
  'Levo um tempo, mas acabei organizando dentro de mim.',
  'Guarde para mim e evite mostrar.',
  'Nem sempre entendo o que estou sentindo.',
];

const pensarFuturo = [
  'Sinto esperança e curiosidade',
  'Fico ansioso(a) ou confuso(a) com o que pode acontecer',
  'Ainda não consigo imaginar como será',
  'Sinto insegurança e dúvidas',
  'Tenho vontade de melhorar e fazer mudanças.',
];

const FeedbackScreen = () => {
  const [selecionadoComoCostumaLidar, setSelecionadoComoCostumaLidar] = useState<string | null>(null);
  const [selecionadoPensarFuturo, setSelecionadoPensarFuturo] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(5);


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
            <Text style={styles.title}>❤️ Como você costuma lidar com seus sentimentos?</Text>
            {comoCostumaLidar.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoComoCostumaLidar(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoComoCostumaLidar === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>🌀 Quando você pensa no futuro, qual dessas frases mais combinam com o que sente ou imagina?</Text>
            {pensarFuturo.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcao}
                onPress={() => setSelecionadoPensarFuturo(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoPensarFuturo === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={styles.opcaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              🌟 O quanto você sente que está preparado(a) ou confiante em relação ao seu futuro neste momento?
            </Text>

            {/* Valor acima da barra */}
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderValueText}>{sliderValue}</Text>
            </View>

            <Slider
              minimumValue={0}
              maximumValue={10}
              value={sliderValue}
              onValueChange={setSliderValue}
              step={1}
              minimumTrackTintColor="#4CAF50" // verde
              maximumTrackTintColor="#ddd"
              thumbTintColor="#4CAF50"
              style={{ marginTop: 10 }}
            />

            <View style={styles.sliderLabels}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelValue}>0</Text>
                <Text style={styles.labelText}>Nada{'\n'}confiante</Text>
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.labelValue}>5</Text>
                <Text style={styles.labelText}>Mais ou{'\n'}menos</Text>
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.labelValue}>10</Text>
                <Text style={styles.labelText}>Muito{'\n'}confiante</Text>
              </View>
            </View>
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

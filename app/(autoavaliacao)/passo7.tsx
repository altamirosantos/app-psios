import { useForm } from '@/context/FormContext';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const FeedbackScreen = () => {

  const [sliderValue, setSliderValue] = useState(80);

  const { updateForm } = useForm();

  const handleNext = () => {
    updateForm({ passo7Card1: sliderValue });
    router.push('/passo8');
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
            <Text style={styles.title}>
              🧩 De 0 a 100, quanto você acredita no pensamento que causou essas sensações e sentimentos?
            </Text>

            {/* Valor acima da barra */}
            <View style={styles.sliderValueContainer}>
              <Text style={styles.sliderValueText}>{sliderValue}</Text>
            </View>

            {Platform.OS === 'web' ? (
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
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
                maximumValue={100}
                value={sliderValue}
                onValueChange={setSliderValue}
                step={1}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#4CAF50"
                style={{ marginTop: 10 }}
              />
            )}


            <View style={styles.sliderLabels}>
              <View style={styles.labelContainerLeft}>
                <Text style={styles.labelValue}>0</Text>
                <Text style={styles.labelText}>Quase nada</Text>
              </View>



              <View style={styles.labelContainerRight}>
                <Text style={styles.labelValue}>100</Text>
                <Text style={styles.labelText}>Totalmente</Text>
              </View>
            </View>
          </View>

          {/* Botão próximo */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
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

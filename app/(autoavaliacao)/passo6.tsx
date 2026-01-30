import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
//import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';



const Passo6 = () => {
  //const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  const [sliderValue, setSliderValue] = useState(80);



  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleNext = () => {
    //updateForm({ passo06Pergunta1: sliderValue.toString() });
    router.push('/passo7');
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
            <Text style={[styles.title, { color: textColor }]}>
              🧩 Com base na sua resposta anterior. De 0 a 100, qual o impacto deste pensamento no seu bem-estar?
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
                <Text style={[styles.labelValue, { color: textColor }]}>0</Text>
                <Text style={[styles.labelText, { color: textColor }]}>Quase nada</Text>
              </View>



              <View style={styles.labelContainerRight}>
                <Text style={[styles.labelValue, { color: textColor }]}>100</Text>
                <Text style={[styles.labelText, { color: textColor }]}>Totalmente</Text>
              </View>
            </View>
          </View>

          <CustomButton
            title="Próximo..."
            onPress={handleNext}
            disabled={false}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo6;
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

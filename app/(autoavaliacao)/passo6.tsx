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
  View
} from 'react-native';
import { Checkbox } from 'react-native-paper';

import { CustomButton } from '@/components/CustomButton';
import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';



const Passo6 = () => {
  const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');
  const [selectedItemsPasso6, setSelectedItemsPasso6] = useState<string[]>([]);



  const emotionalFactors = [
    "Estresse no trabalho ou estudos.",
    "Conflitos familiares ou relacionamentos.",
    "Preocupações financeiras.",
    "Problemas de saúde física.",
    "Solidão ou isolamento",
    "Falta de sono ou cansaço.",
    "Expectativas altas sobre si.",
    "Luto.",
    "Insegurança com o futuro.",
    "Falta de tempo para si",
    "Mudanças climáticas",
    "Nenhum",
    "Outro"
  ];



  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const toggleItem = (item: string) => {
    if (selectedItemsPasso6.includes(item)) {
      setSelectedItemsPasso6(selectedItemsPasso6.filter(i => i !== item));
    } else {
      setSelectedItemsPasso6([...selectedItemsPasso6, item]);
    }
  };

  const handleNext = () => {
    updateForm({ selectedItemsPasso6: selectedItemsPasso6 });
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
            <View style={styles.header}>
              <Text style={[styles.title, { color: textColor }]}>
                🌀 Alguns desses fatores estão afetando seu estado emocional nesse momento?
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: textColor }]}>Marque as opções que se aplicam:</Text>
            {emotionalFactors.map((item, index) => (
              <View key={index} style={[styles.checkboxContainer, { backgroundColor: inputBg }]}>
                <Checkbox
                  status={selectedItemsPasso6.includes(item) ? 'checked' : 'unchecked'}
                  onPress={() => toggleItem(item)}
                />
                <Text style={[styles.checkboxLabel, { color: textColor }]}>{item}</Text>
              </View>
            ))}
          </View>

          <CustomButton
            title="Me conte mais..."
            onPress={handleNext}
            disabled={selectedItemsPasso6.length === 0}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap'
  },
  checkboxList: {
    maxHeight: 300 // ou remova se quiser scroll infinito
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333'
  }
});

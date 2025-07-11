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
import { Checkbox } from 'react-native-paper';

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
  "Nenhum desses",
  "Outro (específico)"
];

const FeedbackScreen = () => {
  const [selectedItemsPasso6, setSelectedItemsPasso6] = useState<string[]>([]);

  const { updateForm } = useForm();

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
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>
                🌀 Alguns desses fatores estão afetando seu estado emocional nesse momento?
              </Text>
            </View>
            <Text style={styles.subtitle}>Marque as opções que se aplicam:</Text>
            {emotionalFactors.map((item, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <Checkbox
                  status={selectedItemsPasso6.includes(item) ? 'checked' : 'unchecked'}
                  onPress={() => toggleItem(item)}
                />
                <Text style={styles.checkboxLabel}>{item}</Text>
              </View>
            ))}
          </View>


          {/* Botão próximo */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedItemsPasso6.length === 0 && { backgroundColor: '#ccc' },
            ]}
            disabled={selectedItemsPasso6.length === 0}
            onPress={handleNext}
          >
            <Text style={[
              styles.buttonText,
              selectedItemsPasso6.length === 0 && { color: '#aaa' },
            ]}>Me conte mais...</Text>
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

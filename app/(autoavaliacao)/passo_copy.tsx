import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const options = {
  emotions: [
    "Alegria", "Tristeza", "Raiva", "Medo", "Surpresa", "Nojo", "Confiança",
    "Antecipação", "Amor", "Culpa", "Vergonha", "Ansiedade", "Esperança", "Compaixão",
    "Orgulho", "Gratidão", "Sensação de desmaio", "Sensação de bolo na garganta", "Tontura",
    "Suor frio", "Náuseas", "Sufocamento", "Palpitações", "Dor ou pressão no peito",
    "Tremor", "Vazio", "Desesperança", "Me sentindo estranho(a)"
  ],
  reactions: [
    "Fugi", "Evitei", "Paralisei", "Andei de um lado para o outro", "Recusei",
    "Chorei", "Não fiz", "Fiquei calado", "Me isolei"
  ],
  factors: [
    "Estresse no trabalho ou estudos", "Conflitos familiares ou relacionamentos",
    "Preocupações financeiras", "Problemas de saúde física", "Solidão ou isolamento", "Falta de sono ou cansaço",
    "Expectativas altas sobre si", "Luto", "Insegurança com o futuro", "Falta de tempo para si",
    "Mudanças climáticas", "Nenhum desses", "Outro (específico)"
  ]
};

const FeedbackScreen = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [trigger, setTrigger] = useState('');
  const [thoughts, setThoughts] = useState('');

  const toggleOption = (option: string, setState: React.Dispatch<React.SetStateAction<string[]>>, state: string[]) => {
    if (state.includes(option)) {
      setState(state.filter(item => item !== option));
    } else {
      setState([...state, option]);
    }
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
            <Text style={styles.title}>Quais emoções você está sentindo agora?</Text>
            <Text style={styles.subtitle}>Selecione todas as emoções que se aplicam.</Text>
            <View style={styles.tagContainer}>
              {options.emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  style={[
                    styles.tag,
                    selectedEmotions.includes(emotion) && styles.tagSelected
                  ]}
                  onPress={() => toggleOption(emotion, setSelectedEmotions, selectedEmotions)}
                >
                  <Text style={selectedEmotions.includes(emotion) ? styles.tagTextSelected : styles.tagText}>
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Que reações você teve diante desses sentimentos?</Text>
            <Text style={styles.subtitle}>Marque todas as opções que se aplicam.</Text>
            <View style={styles.tagContainer}>
              {options.reactions.map((reaction) => (
                <TouchableOpacity
                  key={reaction}
                  style={[
                    styles.tag,
                    selectedReactions.includes(reaction) && styles.tagSelected
                  ]}
                  onPress={() => toggleOption(reaction, setSelectedReactions, selectedReactions)}
                >
                  <Text style={selectedReactions.includes(reaction) ? styles.tagTextSelected : styles.tagText}>
                    {reaction}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Identificando distorções cognitivas</Text>
            <Text style={styles.subtitle}>Em uma escala de 0 a 100, quanto você cogita ser verdadeiro o que sua mente diz?</Text>
            <Slider
              minimumValue={0}
              maximumValue={100}
              value={sliderValue}
              onValueChange={setSliderValue}
              style={{ marginTop: 10 }}
            />
            <Text style={styles.sliderValue}>{Math.round(sliderValue)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Fatores influenciadores</Text>
            <Text style={styles.subtitle}>Quais desses fatores estão afetando seu estado emocional nesse momento? Marque as opções que se aplicam:</Text>
            <View style={styles.tagContainer}>
              {options.factors.map((factor) => (
                <TouchableOpacity
                  key={factor}
                  style={[
                    styles.tag,
                    selectedFactors.includes(factor) && styles.tagSelected
                  ]}
                  onPress={() => toggleOption(factor, setSelectedFactors, selectedFactors)}
                >
                  <Text style={selectedFactors.includes(factor) ? styles.tagTextSelected : styles.tagText}>
                    {factor}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Detalhes Adicionais</Text>
            <Text style={styles.subtitle}>O que aconteceu? Descreva a situação, quando e onde ocorreu, o que fez e quem esteve envolvido.</Text>
            <TextInput
              style={styles.input}
              placeholder="O que aconteceu?"
              value={trigger}
              onChangeText={setTrigger}
              multiline
            />
            <Text style={styles.subtitle}>Qual foi o gatilho? Identifique o estímulo que despertou sua emoção. Palavras, cheiros, músicas ou tom de voz podem despertar emoções intensas, decisões e gerar reações físicas ou impulsivas.</Text>
            <TextInput
              style={styles.input}
              placeholder="Qual foi o gatilho?"
              value={trigger}
              onChangeText={setTrigger}
              multiline
            />
            <Text style={styles.subtitle}>Que pensamento, imagem ou lembrança veio antes da emoção? O que mais te incomodou?</Text>
            <TextInput
              style={styles.input}
              placeholder="O que mais te incomodou?"
              value={thoughts}
              onChangeText={setThoughts}
              multiline
            />
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Enviar Feedback</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Obrigado por compartilhar seus sentimentos. Suas respostas nos ajudam a melhorar nossos serviços e oferecer suporte personalizado.
          </Text>

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default FeedbackScreen;

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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagSelected: {
    backgroundColor: '#6366f1',
  },
  tagText: {
    color: '#333',
  },
  tagTextSelected: {
    color: '#fff',
  },
  sliderValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerNote: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
});

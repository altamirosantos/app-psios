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



const Passo11 = () => {
  const { updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');
  const [selecionado, setSelecionado] = useState<string | null>(null);



  const opcoes = [
    { id: 1, label: "Espelho 1 – Confiante e Positiva", emoji: "🌟" },
    { id: 2, label: "Espelho 2 – Em busca de si mesma(o)", emoji: "☁️" },
    { id: 3, label: "Espelho 3 – Crítico e Exigente", emoji: "😔" },
    { id: 4, label: "Espelho 4 – Fragilizada(o) emocionalmente", emoji: "🌧️" },
    { id: 5, label: "Espelho 5 – Em construção com carinho", emoji: "✨" },
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
    updateForm({ espelho: selecionado ?? '' });
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
            <Text style={[styles.title, { color: textColor }]}>
              🪞Qual espelho representa melhor como você se vê hoje?
              Escolha a opção que mais representa o seu autoconceito no momento:
            </Text>

            <View style={styles.containerImage}>
              <Image source={require("@/assets/images/mirror.png")} style={styles.imagem} resizeMode="contain" />

              {/* Números sobre a imagem */}
              <Text style={[styles.numero, styles.pos1]}>1</Text>
              <Text style={[styles.numero, styles.pos2]}>2</Text>
              <Text style={[styles.numero, styles.pos3]}>3</Text>
              <Text style={[styles.numero, styles.pos4]}>4</Text>
              <Text style={[styles.numero, styles.pos5]}>5</Text>
            </View>

            <View style={styles.opcoes}>
              {opcoes.map((opcao) => (
                <TouchableOpacity
                  key={opcao.id}
                  style={[styles.opcao, selecionado === opcao.label && styles.opcaoSelecionada]}
                  onPress={() => setSelecionado(opcao.label)}
                >
                  <Text style={styles.opcaoTexto}>
                    {opcao.emoji} {opcao.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <CustomButton
            title="Enviar"
            onPress={handleNext}
            disabled={!selecionado}
          />

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo11;
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
    alignItems: 'center',
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
  containerImage: {
    position: 'relative',
    width: 344,
    height: 344,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  imagem: {
    width: 344,
    height: 344,
  },
  opcoes: {
    width: "100%",
    marginBottom: 40,
  },
  opcao: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  opcaoSelecionada: {
    borderColor: "#6200EE",
    backgroundColor: "#E0D7F8",
  },
  opcaoTexto: {
    fontSize: 16,
  },
  numero: {
    position: 'absolute',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6B21A8', // roxo escuro
  },
  pos1: {
    left: '12%',
    bottom: 50,
  },
  pos2: {
    left: '30%',
    bottom: 40,
  },
  pos3: {
    left: '47%',
    bottom: 50,
  },
  pos4: {
    left: '63%',
    bottom: 40,
  },
  pos5: {
    left: '80%',
    bottom: 50,
  },
});

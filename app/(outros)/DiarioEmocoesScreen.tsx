import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DiarioEmocoesScreen = () => {
  const [texto, setTexto] = useState('');
  const [tecnicas, setTecnicas] = useState<string[]>([]);

  const sugerirTecnicas = () => {
    if (!texto.trim()) return;

    // Simulação de sugestão automática baseada em palavras-chave
    let sugestoes: string[] = [];

    if (texto.match(/ansioso|preocupado|tenso/i))
      sugestoes = ['Respiração 4-7-8', 'Meditação guiada curta', 'Alongamento leve'];
    else if (texto.match(/triste|desanimado|cansado/i))
      sugestoes = ['Visualização positiva', 'Gratidão em 3 frases', 'Respiração profunda'];
    else if (texto.match(/feliz|grato|motivado/i))
      sugestoes = ['Reflexão sobre conquistas', 'Planejar o próximo passo', 'Compartilhar positividade'];
    else
      sugestoes = ['Autoavaliação rápida', 'Meditação de foco', 'Técnica de respiração alternada'];

    setTecnicas(sugestoes);
  };

  return (
    <View style={styles.containerRoot}>
      {/* TOPO COM GRADIENTE */}
      <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diário de Emoções</Text>
      </LinearGradient>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <Image
          source={require('@/assets/images/insignia2.png')}
          style={styles.banner}
          resizeMode="contain"
        />

        {/* Descrição */}
        <Text style={styles.descricao}>
          Registre como está se sentindo hoje. O app irá sugerir técnicas para equilibrar suas emoções e melhorar o bem-estar.
        </Text>

        {/* Campo de texto */}
        <Text style={styles.subtitulo}>Como você está se sentindo?</Text>
        <TextInput
          style={styles.inputTexto}
          placeholder="Escreva aqui seus pensamentos ou sentimentos..."
          multiline
          value={texto}
          onChangeText={setTexto}
        />

        <TouchableOpacity style={styles.botao} onPress={sugerirTecnicas}>
          <Text style={styles.botaoTexto}>Sugerir Técnicas</Text>
        </TouchableOpacity>

        {/* Sugestões */}
        {tecnicas.length > 0 && (
          <View style={styles.sugestoesContainer}>
            <Text style={styles.subtitulo}>Sugestões para você</Text>
            {tecnicas.map((item, i) => (
              <TouchableOpacity key={i} style={styles.cardSugestao}>
                <Feather name="star" size={22} color="#7b2ff7" style={{ marginRight: 10 }} />
                <Text style={styles.sugestaoTexto}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: { flex: 1, backgroundColor: '#fdfcff' },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20, alignItems: 'center' },
  banner: { width: width * 0.8, height: 180, marginBottom: 20 },
  descricao: {
    color: '#444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  subtitulo: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  inputTexto: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: width * 0.9,
    minHeight: 120,
    fontSize: 15,
    color: '#333',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  botao: {
    marginTop: 15,
    backgroundColor: '#7b2ff7',
    borderRadius: 15,
    paddingVertical: 14,
    width: width * 0.9,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
  sugestoesContainer: { marginTop: 25, width: width * 0.9 },
  cardSugestao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sugestaoTexto: { color: '#333', fontSize: 15 },
});

export default DiarioEmocoesScreen;

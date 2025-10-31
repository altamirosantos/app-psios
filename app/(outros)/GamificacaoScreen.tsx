import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GamificacaoScreen = () => {
  const [xp, setXp] = useState(1200);
  const [nivel, setNivel] = useState(3);

  const desafios = [
    { id: 1, titulo: '7 dias de Gratidão', progresso: 5, total: 7 },
    { id: 2, titulo: 'Pratique respiração por 3 dias', progresso: 2, total: 3 },
  ];

  const insignias = [
    { id: 1, nome: 'Mente Serena', icone: require('@/assets/images/insignia1.png') },
    { id: 2, nome: 'Diário Dedicado', icone: require('@/assets/images/insignia2.png') },
  ];

  return (
    <View style={styles.containerRoot}>
      {/* TOPO COM GRADIENTE */}
      <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sua Jornada de Autocuidado</Text>
      </LinearGradient>

      {/* CONTEÚDO COM FUNDO CLARO */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Nível e XP */}
        <View style={styles.cardNivel}>
          <Text style={styles.nivelTexto}>Nível {nivel}</Text>
          <Text style={styles.xpTexto}>{xp} XP</Text>
          <View style={styles.barraXp}>
            <View style={[styles.barraXpProgresso, { width: `${(xp % 1000) / 10}%` }]} />
          </View>
          <Text style={styles.progressoTexto}>Próximo nível em {1000 - (xp % 1000)} XP</Text>
        </View>

        {/* Insígnias */}
        <Text style={styles.subtitulo}>Suas Conquistas</Text>
        <View style={styles.containerInsignias}>
          {insignias.map((item) => (
            <View key={item.id} style={styles.insigniaItem}>
              <Image source={item.icone} style={styles.insigniaIcone} />
              <Text style={styles.insigniaNome}>{item.nome}</Text>
            </View>
          ))}
        </View>

        {/* Desafios Atuais */}
        <Text style={styles.subtitulo}>Desafios da Semana</Text>
        {desafios.map((item) => (
          <View key={item.id} style={styles.cardDesafio}>
            <Text style={styles.desafioTitulo}>{item.titulo}</Text>
            <View style={styles.barraDesafio}>
              <View style={[styles.barraDesafioProgresso, { width: `${(item.progresso / item.total) * 100}%` }]} />
            </View>
            <Text style={styles.desafioProgresso}>
              {item.progresso}/{item.total} concluídos
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: { flex: 1, backgroundColor: '#f8f8f8' },
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
  cardNivel: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: width * 0.9,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  nivelTexto: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  xpTexto: { color: '#555', fontSize: 18, marginTop: 5 },
  barraXp: {
    backgroundColor: '#e0e0e0',
    height: 10,
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  barraXpProgresso: {
    backgroundColor: '#9333ea',
    height: '100%',
  },
  progressoTexto: { color: '#555', fontSize: 14, marginTop: 8 },
  subtitulo: { color: '#333', fontSize: 20, fontWeight: '600', marginTop: 10, marginBottom: 10 },
  containerInsignias: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 },
  insigniaItem: { alignItems: 'center', marginHorizontal: 10 },
  insigniaIcone: { width: 60, height: 60, marginBottom: 5 },
  insigniaNome: { color: '#333', fontSize: 14 },
  cardDesafio: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    width: width * 0.9,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  desafioTitulo: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  barraDesafio: {
    backgroundColor: '#e0e0e0',
    height: 8,
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden',
  },
  barraDesafioProgresso: {
    backgroundColor: '#9333ea',
    height: '100%',
  },
  desafioProgresso: { color: '#555', fontSize: 12, marginTop: 5 },
});

export default GamificacaoScreen;

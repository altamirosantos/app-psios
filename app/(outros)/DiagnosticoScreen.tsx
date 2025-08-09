import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DiagnosticoScreen = () => {
  const exercicios = [
    { id: 1, titulo: 'Exercício de Respiração', tipo: 'Vídeo' },
    { id: 2, titulo: 'Meditação Guiada', tipo: 'Áudio' },
    { id: 3, titulo: 'Diário de Emoções', tipo: 'Texto' },
  ];

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.containerImage}>
          <Image source={require("@/assets/images/avatar-autoavaliacao.png")} style={styles.imagem} resizeMode="contain" />
        </View>

        {/* Botão de Diagnóstico */}
        <TouchableOpacity style={[styles.card, styles.diagnosticoCard]} onPress={() => setModalVisible(true)}>
          <Text style={styles.diagnosticoTitle}>📋 Seu Guia de Cuidado</Text>
          <Text style={styles.diagnosticoText} numberOfLines={3} ellipsizeMode="tail">
            Preparamos uma análise gentil do seu momento, com dicas e orientações feitas para você. Toque aqui para saber mais.
          </Text>
        </TouchableOpacity>

        {/* Lista de Exercícios */}
        <Text style={styles.sectionTitle}>Sugestões de Autocuidado</Text>
        {exercicios.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => setModalVisible(true)}>
            <Text style={styles.exerciseTitle}>{item.titulo}</Text>
            <Text style={styles.exerciseSubtitle}>{item.tipo}</Text>
          </TouchableOpacity>
        ))}

        {/* Botão final */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/start-autoavaliacao')}
        >
          <Text style={styles.buttonText}>👉 Refazer Autoavaliação</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Elegante */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Análise enviada</Text>
            <Text style={styles.modalMessage}>
              Sua análise foi enviada para um de nossos especialistas.
              Nesta fase do projeto, os resultados ainda não serão exibidos no aplicativo, mas em breve você poderá acompanhar tudo diretamente por aqui.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
};

export default DiagnosticoScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: {
    flex: 1,
    paddingBottom: 50,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  diagnosticoCard: {
    backgroundColor: '#E0CDFD',
    borderColor: '#7E22CE',
    borderWidth: 1.5,
  },
  diagnosticoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#4B0082',
  },
  diagnosticoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 14,
    color: '#fff',
    textAlign: 'center',
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    textAlign: 'center',
  },
  exerciseSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  button: {
    backgroundColor: '#FFA45E',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 30,
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
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagem: {
    width: 244,
    height: 244,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2D4B73',
  },
  modalMessage: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2D4B73',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

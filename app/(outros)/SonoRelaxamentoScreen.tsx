import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SonoRelaxamentoScreen = () => {
    const exercicios = [
        { id: 1, titulo: 'Respiração Profunda', tipo: 'Áudio', duracao: '5 min', imagem: require('@/assets/images/insignia1.png') },
        { id: 2, titulo: 'Meditação Noturna', tipo: 'Vídeo', duracao: '10 min', imagem: require('@/assets/images/insignia2.png') },
        { id: 3, titulo: 'Relaxamento Muscular', tipo: 'Áudio', duracao: '8 min', imagem: require('@/assets/images/insignia1.png') },
    ];

    return (
        <View style={styles.containerRoot}>
            {/* TOPO COM GRADIENTE */}
            <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sono e Relaxamento</Text>
            </LinearGradient>

            {/* CONTEÚDO */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Banner/Imagem */}
                <Image
                    source={require('@/assets/images/avatar-autoavaliacao.png')}
                    style={styles.banner}
                    resizeMode="contain"
                />

                {/* Descrição */}
                <Text style={styles.descricao}>
                    Encontre equilíbrio e serenidade com exercícios guiados para acalmar a mente e melhorar seu sono.
                </Text>

                {/* Lista de Exercícios */}
                <Text style={styles.subtitulo}>Exercícios Guiados</Text>
                {exercicios.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.cardExercicio}>
                        <Image source={item.imagem} style={styles.exercicioIcone} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.exercicioTitulo}>{item.titulo}</Text>
                            <Text style={styles.exercicioInfo}>{item.tipo} • {item.duracao}</Text>
                        </View>
                        <Feather name="play-circle" size={26} color="#5e60ce" />
                    </TouchableOpacity>
                ))}

                {/* Dica do dia */}
                <View style={styles.dicaContainer}>
                    <Text style={styles.dicaTitulo}>🌙 Dica para hoje</Text>
                    <Text style={styles.dicaTexto}>
                        Evite telas brilhantes antes de dormir e pratique 5 minutos de respiração consciente.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    containerRoot: { flex: 1, backgroundColor: '#f9f9ff' },
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
    cardExercicio: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        width: width * 0.9,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    exercicioIcone: { width: 50, height: 50, marginRight: 15 },
    exercicioTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    exercicioInfo: { fontSize: 13, color: '#666', marginTop: 3 },
    dicaContainer: {
        backgroundColor: '#e0e7ff',
        borderLeftWidth: 4,
        borderLeftColor: '#5e60ce',
        padding: 15,
        borderRadius: 10,
        width: width * 0.9,
        marginTop: 20,
    },
    dicaTitulo: { color: '#5e60ce', fontWeight: '700', marginBottom: 5 },
    dicaTexto: { color: '#333', lineHeight: 20 },
});

export default SonoRelaxamentoScreen;

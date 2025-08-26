import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { AudioLines, BookOpen, Dumbbell, Mic, Video } from "lucide-react-native";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const recursos = [
    { id: "1", titulo: "Áudios", icone: AudioLines, cor: "#4F46E5" },
    { id: "2", titulo: "Vídeos", icone: Video, cor: "#10B981" },
    { id: "3", titulo: "Textos", icone: BookOpen, cor: "#F59E0B" },
    { id: "4", titulo: "Exercícios", icone: Dumbbell, cor: "#EF4444" },
    { id: "5", titulo: "Podcasts", icone: Mic, cor: "#3B82F6" },
];

export default function RecursosApoio() {
    const navigation = useNavigation(); const handleLogout = async () => {
        try {
            // Remove a SESSION_KEY
            //await AsyncStorage.removeItem(SESSION_KEY);

            // Redireciona para a home
            router.push('/(tabs)/home');
        } catch (error) {
            console.log('Erro ao sair:', error);
        }
    };
    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#9333ea', '#d763f8']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    {/* Botão voltar */}
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={26} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Recursos de Apoio
                    </Text>
                    {/* Placeholder p/ alinhar o título no centro */}
                    <View style={{ width: 26 }} />
                </View>
            </LinearGradient>

            <View style={{ flex: 1, padding: 16 }}>
                <FlatList
                    data={recursos}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
                    renderItem={({ item }) => {
                        const Icon = item.icone;
                        return (
                            <TouchableOpacity
                                onPress={() => router.push(`/(outros)/RecursoDetalhe?titulo=${item.titulo}&cor=${encodeURIComponent(item.cor)}`)}
                                style={{
                                    flex: 1,
                                    backgroundColor: "white",
                                    borderRadius: 16,
                                    padding: 20,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginHorizontal: 4,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    shadowOffset: { width: 0, height: 2 },
                                    elevation: 3,
                                }}
                            >
                                <Icon size={32} color={item.cor} />
                                <Text style={{ marginTop: 8, fontSize: 16, fontWeight: "600", color: "#374151" }}>
                                    {item.titulo}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f5f9' },
    header: { paddingTop: 50, paddingBottom: 20, alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', width: "70%" },
    headerContent: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
});

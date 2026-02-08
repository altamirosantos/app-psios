import { resourcesService } from "@/services/resources.service";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Category {
    id: string;
    name: string;
    description?: string;
}

// Mapa de cores para categorias
const categoryColors: Record<string, string> = {
    "Sono": "#4F46E5",
    "Relaxamento": "#10B981",
    "Meditação": "#F59E0B",
    "Exercícios": "#EF4444",
    "Podcasts": "#3B82F6",
};

export default function RecursosApoio() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await resourcesService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
            setError('Erro ao carregar categorias. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, []);

    const renderCategoryCard = ({ item }: { item: Category }) => {
        const cor = categoryColors[item.name] || "#9333ea";
        return (
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/(outros)/RecursoDetalhe',
                    params: { categoryId: item.id, categoryName: item.name }
                })}
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
                    marginBottom: 12,
                }}
            >
                <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: `${cor}20`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12,
                }}>
                    <Feather name="layers" size={28} color={cor} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", textAlign: 'center' }}>
                    {item.name}
                </Text>
                {item.description && (
                    <Text style={{ fontSize: 12, color: "#999", marginTop: 4, textAlign: 'center' }} numberOfLines={1}>
                        {item.description}
                    </Text>
                )}
            </TouchableOpacity>
        );
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

            {/* Conteúdo */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d763f8" />
                    <Text style={styles.loadingText}>Carregando categorias...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={48} color="#ef4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={carregarCategorias}>
                        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flex: 1, padding: 16 }}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                        renderItem={renderCategoryCard}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Feather name="inbox" size={48} color="#ccc" />
                                <Text style={styles.emptyText}>Nenhuma categoria disponível</Text>
                            </View>
                        }
                    />
                </View>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#9333ea',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
});

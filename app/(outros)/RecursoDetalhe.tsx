import ResourcePlayer from '@/components/ResourcePlayer';
import { Resource, resourcesService } from '@/services/resources.service';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecursoDetalhe() {
    const params = useSearchParams();
    const categoryId = params.get("categoryId") as string;
    const categoryName = params.get("categoryName") as string;

    const [recursos, setRecursos] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [playerVisible, setPlayerVisible] = useState(false);

    useEffect(() => {
        if (categoryName) {
            carregarRecursos();
        }
    }, [categoryName]);

    const carregarRecursos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await resourcesService.getResourcesByCategory(categoryName);
            setRecursos(data);
        } catch (err) {
            console.error('Erro ao carregar recursos:', err);
            setError('Erro ao carregar recursos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [categoryName]);

    const handleOpenPlayer = (resource: Resource) => {
        setSelectedResource(resource);
        setPlayerVisible(true);
    };

    const handleClosePlayer = () => {
        setPlayerVisible(false);
        setSelectedResource(null);
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'audio':
                return <Feather name="volume-2" size={24} color="#d763f8" />;
            case 'video':
                return <Feather name="video" size={24} color="#d763f8" />;
            case 'text':
                return <Feather name="file-text" size={24} color="#d763f8" />;
            default:
                return <Feather name="play-circle" size={24} color="#d763f8" />;
        }
    };

    const renderResourceCard = ({ item }: { item: Resource }) => (
        <TouchableOpacity
            style={styles.cardExercicio}
            onPress={() => handleOpenPlayer(item)}
            activeOpacity={0.8}
        >
            <View style={styles.cardIconContainer}>
                {getTypeIcon(item.type)}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.exercicioTitulo} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.exercicioInfo} numberOfLines={1}>
                    {item.type.toUpperCase()}
                    {item.duration ? ` • ${item.duration} min` : ''}
                </Text>
                {item.description && (
                    <Text style={styles.cardDescription} numberOfLines={1}>
                        {item.description}
                    </Text>
                )}
            </View>
            <Feather name="play-circle" size={28} color="#9333ea" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.containerRoot}>
            {/* TOPO COM GRADIENTE */}
            <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{categoryName}</Text>
            </LinearGradient>

            {/* CONTEÚDO */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d763f8" />
                    <Text style={styles.loadingText}>Carregando recursos...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={48} color="#ef4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={carregarRecursos}>
                        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.scrollContent}
                    data={recursos}
                    renderItem={renderResourceCard}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <>
                            {/* Banner/Imagem */}
                            <Image
                                source={require('@/assets/images/avatar-autoavaliacao.png')}
                                style={styles.banner}
                                resizeMode="contain"
                            />

                            {/* Descrição */}
                            <Text style={styles.descricao}>
                                Explore os recursos disponíveis desta categoria para melhorar seu bem-estar.
                            </Text>

                            {/* Título da Lista */}
                            <Text style={styles.subtitulo}>
                                {recursos.length > 0 ? 'Recursos Disponíveis' : 'Nenhum recurso disponível'}
                            </Text>
                        </>
                    }
                    scrollEnabled={true}
                />
            )}

            {/* Resource Player Modal */}
            <ResourcePlayer
                visible={playerVisible}
                resource={selectedResource}
                onClose={handleClosePlayer}
            />
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    containerRoot: { 
        flex: 1, 
        backgroundColor: '#f9f9ff' 
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: { 
        marginRight: 10 
    },
    headerTitle: { 
        color: '#fff', 
        fontSize: 20, 
        fontWeight: 'bold',
        flex: 1,
    },
    scrollContent: { 
        padding: 20, 
        paddingBottom: 30 
    },
    banner: { 
        width: width * 0.8, 
        height: 180, 
        marginBottom: 20, 
        alignSelf: 'center' 
    },
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
        marginVertical: 10,
        marginHorizontal: 8,
    },
    cardExercicio: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cardIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    exercicioTitulo: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#333', 
        flex: 1 
    },
    exercicioInfo: { 
        fontSize: 13, 
        color: '#999', 
        marginTop: 4 
    },
    cardDescription: { 
        fontSize: 12, 
        color: '#bbb', 
        marginTop: 2 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});

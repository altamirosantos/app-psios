import { Resource } from '@/services/resources.service';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResourcePlayerProps {
    visible: boolean;
    resource: Resource | null;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const ResourcePlayer: React.FC<ResourcePlayerProps> = ({ visible, resource, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isWeb = Platform.OS === 'web';

    useEffect(() => {
        if (!visible) {
            setIsPlaying(false);
            if (isWeb && audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [visible, isWeb]);

    const handleAudioPlay = () => {
        if (isWeb && audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    if (!resource) return null;

    const getEmbedUrl = (url: string) => {
        console.log ('getEmbedUrl', url);
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtube.com')
                ? url.split('v=')[1]?.split('&')[0]
                : url.split('youtu.be/')[1];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    const renderContent = () => {
        switch (resource.type) {
            case 'audio':
                if (isWeb && resource.url) {
                    return (
                        <View style={styles.audioContainer}>
                            <audio
                                ref={audioRef as any}
                                src={resource.url}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                style={{
                                    width: '90%',
                                    marginBottom: 20,
                                }}
                            />
                            <TouchableOpacity
                                style={[styles.playButton, isPlaying && styles.playButtonActive]}
                                onPress={handleAudioPlay}
                            >
                                <Feather
                                    name={isPlaying ? 'pause' : 'play'}
                                    size={32}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                            <Text style={styles.durationText}>
                                {resource.duration ? `${resource.duration} minutos` : 'Duração desconhecida'}
                            </Text>
                        </View>
                    );
                }
                return (
                    <View style={styles.audioContainer}>
                        <View style={styles.audioIconContainer}>
                            <Feather name="volume-2" size={64} color="#d763f8" />
                        </View>
                        <TouchableOpacity
                            style={[styles.playButton, isPlaying && styles.playButtonActive]}
                            onPress={() => setIsPlaying(!isPlaying)}
                        >
                            <Feather
                                name={isPlaying ? 'pause' : 'play'}
                                size={32}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <Text style={styles.durationText}>
                            {resource.duration ? `${resource.duration} minutos` : 'Duração desconhecida'}
                        </Text>
                    </View>
                );

            case 'text':
                return (
                    <View style={styles.textContainer}>
                        <Text style={styles.textContent}>{resource.description}</Text>
                    </View>
                );

            default:
                return (
                    <View style={styles.placeholderContainer}>
                        <Feather name="file" size={48} color="#d763f8" />
                        <Text style={styles.placeholderText}>Tipo de conteúdo não suportado</Text>
                    </View>
                );
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Feather name="x" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {resource.title}
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Content */}
                <View style={styles.content}>{renderContent()}</View>

                {/* Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.typeTag}>{resource.type.toUpperCase()}</Text>
                    {resource.tags && resource.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {resource.tags.slice(0, 3).map((tag, idx) => (
                                <View key={idx} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Close Button */}
                <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
                    <Text style={styles.closeModalButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9ff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    mediaContainer: {
        width: width - 40,
        height: 300,
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden',
    },
    webView: {
        flex: 1,
    },
    audioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        width: 200,
        height: 200,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    audioIconContainer: {
        marginBottom: 20,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#d763f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    playButtonActive: {
        backgroundColor: '#9333ea',
    },
    durationText: {
        color: '#666',
        fontSize: 14,
        marginTop: 10,
    },
    textContainer: {
        flex: 1,
        width: width - 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    textContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        width: width - 40,
        height: 250,
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 16,
        color: '#999',
    },
    detailsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    typeTag: {
        fontSize: 12,
        fontWeight: '600',
        backgroundColor: '#e0e7ff',
        color: '#5e60ce',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    tagText: {
        fontSize: 13,
        color: '#666',
    },
    closeModalButton: {
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 12,
        backgroundColor: '#9333ea',
        borderRadius: 12,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ResourcePlayer;

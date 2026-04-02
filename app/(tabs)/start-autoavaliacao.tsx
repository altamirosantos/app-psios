import { useForm } from '@/context/FormContext2';
import { etapaService } from '@/services/etapa.service';
import { getThemeColors } from '@/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function WelcomeScreen() {
    const router = useRouter();
    const { registrarPerguntas, resetForm } = useForm();
    const colorScheme = useColorScheme();
    const colors = getThemeColors(colorScheme);
    const dynamicStyles = createDynamicStyles(colors);

    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/logo.png')} // coloque sua logo aqui
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>🌻 AUTOAVALIAÇÃO</Text>

                <View style={[styles.card, dynamicStyles.card]}>
                    <Text style={[styles.cardText, { color: colors.text }]}>
                        📝 A autoavaliação é um pequeno
                        passo com grande impacto. É
                        simples, e pode fazer diferença no
                        seu bem-estar.
                    </Text>
                    <Text style={[styles.cardText, { fontWeight: 'bold', color: colors.text }]}>
                        💙 Você merece esse cuidado!
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={async () => {
                    const avaliacaoId = '10e107c2-c4cd-4c87-af11-d4693494875b';
                    
                    try {
                        // Busca TODAS as etapas da avaliação e armazena no contexto
                        const etapas = await etapaService.getEtapasByAvaliacao(avaliacaoId);
                        console.log('Etapas carregadas:', etapas);
                        
                        if (etapas && etapas.length > 0) {
                            // Reseta o formulário antes de começar
                            resetForm();
                            
                            // Navega para a primeira etapa (índice 0)
                            const primeiraEtapa = etapas[0];
                            router.push(
                                `/(autoavaliacao)/PassoScreen?etapaId=${primeiraEtapa.id}&avaliacaoId=${avaliacaoId}`
                            );
                        } else {
                            console.error('Nenhuma etapa encontrada');
                        }
                    } catch (error) {
                        console.error('Erro ao carregar etapas:', error);
                    }
                }
                }>
                    <Text style={styles.buttonText}>Começar minha autoavaliação</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const { width } = Dimensions.get('window');

// 🎨 Factory function para criar estilos dinâmicos baseados no tema
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
    card: {
        backgroundColor: colors.cardBackground,
        shadowColor: colors.text,
        shadowOpacity: 0.05,
    },
});

const styles = StyleSheet.create({
    containerRoot: {
        flex: 1,
    },
    container: {
        flex: 1,
        /*backgroundColor: '#DA5CE3',*/
        alignItems: 'center',
        /*justifyContent: 'center',*/
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
        marginBottom: 30,
        lineHeight: 24,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 50,
        width: '100%',
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#FFA45E',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 50,
        width: width - 80,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
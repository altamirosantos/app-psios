import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
    const router = useRouter();
    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/images/logo.png')} // coloque sua logo aqui
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>🌻 AUTOAVALIAÇÃO</Text>

                <Text style={styles.subtitle}>
                    Pronto(a) para tranformar sua vida?{'\n'}
                    Mude a forma de pensar, sentir e agir
                    com novas conexões e
                    autoconsciência.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardText}>
                        📝 A autoavaliação é um pequeno
                        passo com grande impacto. É
                        simples, e pode fazer diferença no
                        seu bem-estar.
                    </Text>
                    <Text style={[styles.cardText, { fontWeight: 'bold' }]}>
                        💙 Você merece esse cuidado!
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/(autoavaliacao)/passo1')}>
                    <Text style={styles.buttonText}>Começar minha autoavaliação</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const { width } = Dimensions.get('window');

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
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 50,
        width: '100%',
    },
    cardText: {
        fontSize: 16,
        color: '#000',
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

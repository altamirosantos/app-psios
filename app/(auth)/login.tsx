import { login } from '@/services/auth.service';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleLogin = async () => {
        setLoading(true);
        try {
            const user = await login(email, password);
            console.log("Usuário logado:", user.email);
            // redirecionar ou guardar dados se quiser
            //navigation.navigate('(tabs)/home' as never);
            router.replace('/boasVindas');
        } catch (error: any) {
            console.log("Erro ao fazer login:", error.message);
            Alert.alert("Erro de login", error.message);
        } finally {
            setLoading(false);
        }
    };
    const [showPassword, setShowPassword] = useState(false);
    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.container}>
            <View style={styles.container}>
                <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />

                <View style={styles.card}>
                    <Text style={styles.title}>Iniciar</Text>
                    <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

                    <TextInput placeholder="E-mail" placeholderTextColor="#555" style={styles.input} value={email} onChangeText={setEmail} />
                    <View style={styles.passwordContainer}>
                        <TextInput placeholder="Senha" placeholderTextColor="#555" secureTextEntry={!showPassword} style={styles.inputPassword} value={password} onChangeText={setPassword} />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.orText}>Ou Login com</Text>

                    <TouchableOpacity style={styles.socialButton}>
                        <Text style={styles.socialIcon}>🟢</Text>
                        <Text style={styles.socialText}>Continue com Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <Text style={styles.socialIcon}></Text>
                        <Text style={styles.socialText}>Continue com Apple</Text>
                    </TouchableOpacity>

                    <Pressable onPress={() => router.push('/(auth)/signup')}>
                        <Text style={styles.signupText}>
                            Não tem uma conta?
                            <Text style={styles.link}> Cadastre-se aqui</Text>
                        </Text>
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        /*backgroundColor: '#A64BF4',*/
        padding: 20
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 24,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 24, fontWeight: 'bold', color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14, color: '#666', marginBottom: 16,
    },
    input: {
        width: '100%',
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        marginBottom: 16,
        paddingRight: 12,
    },
    inputPassword: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    eyeIcon: {
        fontSize: 18,
        color: '#999',
    },
    loginButton: {
        backgroundColor: '#4F46E5',
        width: '100%',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    orText: {
        color: '#666',
        marginBottom: 12,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        width: '100%',
    },
    socialIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    socialText: {
        fontSize: 16,
        color: '#000',
    },
    signupText: {
        marginTop: 16,
        color: '#444',
    },
    link: {
        color: '#4F46E5',
        fontWeight: '600',
    },
    logoImage: {
        width: 120,
        height: 50,
        marginBottom: 20,
        alignSelf: 'center',
    },
});

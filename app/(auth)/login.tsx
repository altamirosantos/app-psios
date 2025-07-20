import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { Feather } from '@expo/vector-icons';
//import { makeRedirectUri } from 'expo-auth-session';
//import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const textColor = useThemeColor('text');
const cardColor = useThemeColor('cardBackground');
const placeholder = useThemeColor('placeholder');
const inputBg = useThemeColor('inputBackground');

export default function LoginScreen() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { setUser } = useAuth();

    


    // Função login com email/senha (sem alteração)
    const handleLogin = async () => {
        setLoading(true);
        console.log(email)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.log(error)
                throw new Error(error.message);
            }

            console.log('Passou')

            const user = data.user;
            const userId = user.id;

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError || !profile) throw new Error('Erro ao carregar o perfil do usuário.');

            setUser({
                id: userId,
                email: user.email ?? '',
                nome: profile.nome,
                apelido: profile.apelido,
                nascimento: profile.nascimento,
                genero: profile.genero,
            });

            router.replace('/boasVindas');
        } catch (error: any) {
            let errorMessage = 'Erro ao fazer login. Tente novamente.';
            if (error?.message === 'Invalid login credentials') errorMessage = 'Email ou senha inválidos.';
            else if (error?.message) errorMessage = error.message;

            Toast.show({
                type: 'error',
                text1: 'Erro de login',
                text2: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.container}>
            <View style={styles.container}>
                <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <Text style={[styles.title, { color: textColor }]}>Iniciar</Text>
                    <Text style={[styles.subtitle, { color: placeholder }]}>Preencha os dados abaixo</Text>

                    <TextInput
                        placeholder="E-mail"
                        placeholderTextColor={placeholder}
                        style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor={placeholder}
                            secureTextEntry={!showPassword}
                            style={[styles.inputPassword, { backgroundColor: inputBg, color: textColor }]}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login</Text>}
                    </TouchableOpacity>

                    <Text style={[styles.orText, { color: placeholder }]}>Ou Login com</Text>



                    <TouchableOpacity style={styles.socialButton} disabled>
                        <Text style={styles.socialIcon}></Text>
                        <Text style={styles.socialText}>Continue com Apple</Text>
                    </TouchableOpacity>

                    <Pressable onPress={() => router.push('/(auth)/signup')}>
                        <Text style={[styles.signupText, { color: textColor }]}>
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
        padding: 20,
    },
    card: {
        width: '100%',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        backgroundColor: cardColor
    },
    logoImage: {
        width: 120,
        height: 50,
        marginBottom: 20,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        color: textColor
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
        color: textColor
    },
    input: {
        width: '100%',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: inputBg,
        color: textColor
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 16,
        paddingRight: 12,
    },
    inputPassword: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        backgroundColor: inputBg,
        color: textColor
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
    },
    signupText: {
        marginTop: 16,
    },
    link: {
        fontWeight: '600',
    },
});

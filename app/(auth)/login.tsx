import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { loginWithEmail, signInWithFacebook, signInWithGoogle } from '@/services/auth.service';
import { getThemeColors } from '@/theme/theme';
import { Feather } from '@expo/vector-icons';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme as useRNColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';



export default function LoginScreen() {
    // 🎨 Dark Mode
    const colorSchemeRN = useRNColorScheme();
    const colors = getThemeColors(colorSchemeRN);
    const dynamicStyles = createDynamicStyles(colors);

    const textColor = useThemeColor('text');
    const cardColor = useThemeColor('cardBackground');
    const placeholder = useThemeColor('placeholder');
    const inputBg = useThemeColor('inputBackground');

    const scheme = useColorScheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { setUser } = useAuth();


    const handleGoogleLogin = async () => {
        try {
            const { user } = await signInWithGoogle();

            if (!user?.id || !user?.email) throw new Error('Usuário inválido retornado do Google');

            await loginAndRedirect(user.id, user.email);

            Toast.show({
                type: 'success',
                text1: 'Bem-vindo',
                text2: user?.email ?? 'Login bem-sucedido',
            });
            // redirecionar ou salvar token aqui
        } catch (err: any) {
            //const fullError = JSON.stringify(err, null, 2);
            //Alert.alert('Erro detalhado', fullError);
            //console.log(err);
            //Alert.alert(JSON.stringify(err));
            Toast.show({
                type: 'error',
                text1: 'Erro de login',
                text2: err?.message || String(err),
            });
        }
    };

    async function handleLoginFacebook() {
        try {
            setLoading(true);
            await signInWithFacebook();
            router.replace('/home');
        } catch (error: any) {
            //Alert.alert('Erro', error.message || 'Falha no login com Facebook');
            Toast.show({
                type: 'error',
                text1: 'Erro de login',
                text2: error.message || 'Falha no login com Facebook',
            });
        } finally {
            setLoading(false);
        }
    }


    // Função login com email/senha (sem alteração)
    const handleLogin = async () => {
        setLoading(true);
        console.log(email)
        try {
            const data = await loginWithEmail(
                email,
                password,
            );

            console.log('Passou')

            const user = data.user;
            const userId = user.id;

            await loginAndRedirect(userId, user.email ?? '');

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

    const loginAndRedirect = async (userId: string, email: string) => {
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        // Se não existe perfil, cria um
        if (profileError || !profile) {
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{
                    id: userId,
                    email: email,
                    nome: '',       // Pode preencher com nome do Google se disponível
                    apelido: '',
                    nascimento: null,
                    genero: ''
                }])
                .select()
                .single();

            if (insertError) {
                throw new Error('Erro ao criar perfil do usuário.');
            }

            profile = newProfile;
        }

        setUser({
            id: userId,
            email,
            nome: profile.nome,
            apelido: profile.apelido,
            nascimento: profile.nascimento,
            genero: profile.genero,
        });

        if (profile.nome === '') {
            router.replace('/updateProfile');
        } else {
            router.replace('/boasVindas');
        }

    };


    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.container}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
                <View style={[styles.card, dynamicStyles.card]}>
                    <Text style={[styles.title, { color: colors.text }]}>Iniciar</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Preencha os dados abaixo</Text>

                    <TextInput
                        placeholder="E-mail"
                        placeholderTextColor={placeholder}
                        style={[styles.input, dynamicStyles.input]}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor={placeholder}
                            secureTextEntry={!showPassword}
                            style={[styles.inputPassword, dynamicStyles.input]}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login com E-mail</Text>}
                    </TouchableOpacity>


                    <Text style={[styles.orText, { color: placeholder }]}>Ou</Text>

                    <GoogleSigninButton
                        style={{ width: '100%', height: 60, marginBottom: 20, borderRadius: 10 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={
                            scheme === 'dark'
                                ? GoogleSigninButton.Color.Dark
                                : GoogleSigninButton.Color.Light
                        }
                        onPress={handleGoogleLogin}
                    />

                    {/*
                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: '#3b5998' }]}
                        onPress={handleLoginFacebook}
                    >
                        <View style={styles.facebookButtonContent}>
                            <FontAwesome name="facebook" size={20} color="#fff" style={styles.facebookIcon} />
                            <Text style={styles.buttonText}>Login com Facebook</Text>
                        </View>
                    </TouchableOpacity>
*/}

                    <Pressable onPress={() => router.push('/(auth)/signup')}>
                        <Text style={[styles.signupText, { color: colors.text }]}>
                            Não tem uma conta?
                            <Text style={styles.link}> Cadastre-se aqui</Text>
                        </Text>
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
}

// 🎨 Factory function para criar estilos dinâmicos baseados no tema
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  card: {
    backgroundColor: colors.cardBackground,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
  },
  input: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    card: {
        width: '100%',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
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
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    inputPassword: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        fontSize: 16,
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
    button: { backgroundColor: '#6200EE', padding: 15, borderRadius: 5, marginVertical: 5 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    passwordContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 12,
        justifyContent: 'center',
    },

    eyeIcon: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    facebookButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
    },

    facebookIcon: {
        position: 'absolute',
        left: 15, // Mantém o ícone fixo no canto esquerdo
    },


});

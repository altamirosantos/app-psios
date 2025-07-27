import BirthDatePicker from '@/components/BirthDatePicker';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';



export default function SignUpScreen() {
    const textColor = useThemeColor('text');
    const cardColor = useThemeColor('cardBackground');
    const placeholder = useThemeColor('placeholder');
    const inputBg = useThemeColor('inputBackground');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Feminino', value: 'feminino' },
        { label: 'Masculino', value: 'masculino' },
        { label: 'Não binário', value: 'nao-binario' },
        { label: 'Prefiro não informar', value: 'nao-informar' },
        { label: 'Outro', value: 'outro' },
    ]);
    const [customGenero, setCustomGenero] = useState('');

    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const handleSignUp = async () => {
        try {
            if (!email || !password || !confirmPassword) {
                Alert.alert('Erro', 'Preencha todos os campos de e-mail e senha.');
                setLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert('Erro', 'As senhas não coincidem.');
                setLoading(false);
                return;
            }
            setLoading(true);

            // 1. Cria o usuário no Supabase Auth
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                throw new Error(signUpError.message);
            }

            const userId = signUpData?.user?.id;

            console.log('### signUpData  ', signUpData);

            if (!userId) {
                throw new Error('Erro ao obter ID do usuário após cadastro.');
            }

            // 2. Insere dados extras na tabela `profiles`
            const { error: insertError } = await supabase.from('profiles').insert({
                id: userId,
                nome: fullName,
                apelido: nickname,
                nascimento: birthDate,
                email: email,
                genero: (value === 'outro' ? customGenero : value) ?? "",
            });

            if (insertError) {
                throw new Error(insertError.message);
            }

            //Alert.alert('Sucesso', 'Conta criada com sucesso!');
            Toast.show({
                type: 'success',
                text1: 'Cadastro OK',
                text2: 'Cadastro criado com sucesso',
            });
            router.replace('/(auth)/login');

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Erro de Cadastro',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />

                    <View style={[styles.card, { backgroundColor: cardColor }]}>
                        <Text style={[styles.title, { color: textColor }]}>Criar Minha Conta</Text>
                        <Text style={[styles.subtitle, , { color: textColor }]}>
                            Para criar sua conta insira os dados abaixo.
                        </Text>

                        {/* Nome completo */}
                        <Text style={{ fontWeight: '500', marginBottom: 4 }}>Nome Completo</Text>
                        <TextInput
                            placeholder="Nome completo"
                            placeholderTextColor={placeholder}
                            style={[styles.input, { backgroundColor: inputBg }]}
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        {/* Gênero */}
                        <Text style={{ fontWeight: '500', marginBottom: 4 }}>Gênero</Text>
                        <View style={[styles.input, { zIndex: 10, backgroundColor: inputBg }]}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                placeholder="Selecione..."
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={{
                                    backgroundColor: inputBg,
                                    borderWidth: 0,
                                    minHeight: 20,
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: inputBg,
                                    borderColor: '#ccc',
                                }}
                                textStyle={{
                                    fontSize: 16,
                                    color: textColor,
                                }}
                                placeholderStyle={{
                                    color: placeholder,
                                }}
                                labelStyle={{
                                    color: textColor,
                                }}
                                zIndex={10}

                            />
                        </View>

                        {value === 'outro' && (
                            <TextInput
                                placeholder="Informe seu gênero"
                                value={customGenero}
                                onChangeText={setCustomGenero}
                                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                            />
                        )}

                        {/* Apelido */}
                        <Text style={{ fontWeight: '500', marginBottom: 4 }}>
                            Como você gostaria de ser chamado(a)?
                        </Text>
                        <TextInput
                            placeholder="Apelido"
                            placeholderTextColor={placeholder}
                            style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                            value={nickname}
                            onChangeText={setNickname}
                        />

                        <BirthDatePicker value={birthDate} onChange={setBirthDate} />

                        {/* Email */}
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={placeholder}
                            style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Senha */}
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Senha"
                                placeholderTextColor={placeholder}
                                secureTextEntry={!showPassword}
                                style={[styles.inputPassword, { backgroundColor: inputBg, color: textColor }]}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Confirmar Senha */}
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Confirma Senha"
                                placeholderTextColor={placeholder}
                                secureTextEntry={!showConfirmPassword}
                                style={[styles.inputPassword, { backgroundColor: inputBg, color: textColor }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Botão Criar Conta */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Criar Conta</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                            <Text style={[styles.footerText,{color: textColor}]}>
                                Já possui uma conta? <Text style={styles.link}>Acesse aqui</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    containerRoot: {
        flex: 1,
        paddingBottom: 50
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    logoImage: {
        width: 120,
        height: 50,
        marginBottom: 20,
        alignSelf: 'center',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center'
    },
    input: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    inputWithIcon: {
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 12
    },
    inputField: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
    },
    button: {
        backgroundColor: '#4f46e5',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerText: {
        color: '#444',
        textAlign: 'center',
    },
    link: {
        color: '#6366f1',
        fontWeight: '600',
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        width: '100%',
        maxWidth: 400,
    },
     eyeIcon: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
     passwordContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 12,
        justifyContent: 'center',
    },
     inputPassword: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        fontSize: 16,
    },
});

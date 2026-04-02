import BirthDatePicker from '@/components/BirthDatePicker';
import { supabase } from '@/lib/supabase';
import { getThemeColors } from '@/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';



export default function updateProfile() {
    const colorScheme = useColorScheme();
    const colors = getThemeColors(colorScheme);
    const [fullName, setFullName] = useState('');
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

    const handleSave = async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            setLoading(true);
            if (!data.session?.user) {
                throw new Error('Erro ao obter ID do usuário após cadastro.');
            }

            // 2. Atualiza dados extras na tabela `profiles`
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    nome: fullName,
                    apelido: nickname,
                    nascimento: birthDate,
                    email: data.session.user.email,
                    genero: (value === 'outro' ? customGenero : value) ?? "",
                })
                .eq('id', data.session.user.id);

            if (updateError) {
                console.error('Erro ao atualizar perfil:', updateError.message);
            }

            Toast.show({
                type: 'success',
                text1: 'Cadastro OK',
                text2: 'Cadastro atualizado com sucesso',
            });
            router.replace('/boasVindas');

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

                    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[styles.title, { color: colors.text }]}>Me conte um pouco mais sobre você...</Text>
                        <Text style={[styles.subtitle, , { color: colors.text }]}>
                            Assim, poderemos oferecer uma experiência que combine com o seu jeito.
                        </Text>

                        {/* Nome completo */}
                        <Text style={{ fontWeight: '500', marginBottom: 4, color: colors.text }}>Nome Completo</Text>
                        <TextInput
                            placeholder="Nome completo"
                            placeholderTextColor={colors.placeholder}
                            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        {/* Gênero */}
                        <Text style={{ fontWeight: '500', marginBottom: 4, color: colors.text }}>Gênero</Text>
                        <View style={[styles.input, { zIndex: 10, backgroundColor: colors.inputBackground }]}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                placeholder="Selecione..."
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={{
                                    backgroundColor: colors.inputBackground,
                                    borderWidth: 0,
                                    minHeight: 20,
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: colors.inputBackground,
                                    borderColor: '#ccc',
                                }}
                                textStyle={{
                                    fontSize: 16,
                                    color: colors.text,
                                }}
                                placeholderStyle={{
                                    color: colors.placeholder,
                                }}
                                labelStyle={{
                                    color: colors.text,
                                }}
                                zIndex={10}

                            />
                        </View>

                        {value === 'outro' && (
                            <TextInput
                                placeholder="Informe seu gênero"
                                value={customGenero}
                                onChangeText={setCustomGenero}
                                style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                            />
                        )}

                        {/* Apelido */}
                        <Text style={{ fontWeight: '500', marginBottom: 4, color: colors.text }}>
                            Como você gostaria de ser chamado(a)?
                        </Text>
                        <TextInput
                            placeholder="Apelido"
                            placeholderTextColor={colors.placeholder}
                            style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                            value={nickname}
                            onChangeText={setNickname}
                        />

                        <BirthDatePicker value={birthDate} onChange={setBirthDate} />

                        {/* Botão Criar Conta */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Salvar</Text>
                            )}
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
        fontSize: 18,
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

import { registerUser } from '@/app/services/signup.service';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function SignUpScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [name, setName] = useState('');
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
            setLoading(true);
            await registerUser(email, password, {
                nome: fullName,
                apelido: nickname,
                nascimento: birthDate,
                genero: value === 'outro' ? customGenero : value,
            });
            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            router.push('/login');
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Criar Minha Conta</Text>
                        <Text style={styles.subtitle}>
                            Para criar sua conta insira os dados abaixo.
                        </Text>

                        {/* Nome completo */}
                        <TextInput
                            placeholder="Nome completo"
                            placeholderTextColor="#555"
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />

                        {/* Gênero */}
                        <Text style={{ fontWeight: '500', marginBottom: 4 }}>Gênero</Text>
                        <View style={[styles.input, { zIndex: 10 }]}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                placeholder="Selecione..."
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={{
                                    backgroundColor: '#f1f5f9',
                                    borderWidth: 0,
                                    minHeight: 20,
                                }}
                                dropDownContainerStyle={{
                                    backgroundColor: '#f1f5f9',
                                    borderColor: '#ccc',
                                }}
                                textStyle={{
                                    fontSize: 16,
                                    color: '#000',
                                }}
                                placeholderStyle={{
                                    color: '#555',
                                }}
                                labelStyle={{
                                    color: '#000',
                                }}
                                zIndex={10}
                               
                            />
                        </View>

                        {value === 'outro' && (
                            <TextInput
                                placeholder="Informe seu gênero"
                                value={customGenero}
                                onChangeText={setCustomGenero}
                                style={styles.input}
                            />
                        )}

                        {/* Apelido */}
                        <Text style={{ fontWeight: '500', marginBottom: 4 }}>
                            Como você gostaria de ser chamado(a)?
                        </Text>
                        <TextInput
                            placeholder="Apelido"
                            placeholderTextColor="#555"
                            style={styles.input}
                            value={nickname}
                            onChangeText={setNickname}
                        />

                        {/* Data de nascimento */}
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.input}
                        >
                            <Text style={{ color: birthDate ? '#000' : '#555' }}>
                                {birthDate ? birthDate.toLocaleDateString() : 'Data de nascimento'}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={birthDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) setBirthDate(selectedDate);
                                }}
                                maximumDate={new Date()}
                            />
                        )}

                        {/* Email */}
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#555"
                            style={styles.input}
                        />

                        {/* Senha */}
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                placeholder="Senha"
                                placeholderTextColor="#555"
                                secureTextEntry={!showPassword}
                                style={styles.inputField}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Feather
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#999"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirmar Senha */}
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                placeholder="Confirma Senha"
                                placeholderTextColor="#555"
                                secureTextEntry={!showConfirmPassword}
                                style={styles.inputField}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Feather
                                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#999"
                                />
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

                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.footerText}>
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
    container: {
        flex: 1,
        padding: 20,
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
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    inputWithIcon: {
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 12,
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
});

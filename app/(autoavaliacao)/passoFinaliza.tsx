import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';


const PassoFinal = () => {
  const { dadosForm, updateForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  

  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const buscarNomeGenero = async () => {
    /*const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("Usuário não está autenticado.");
      return null;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const nome = userData.fullName;
      const apelido = userData.nickname;
      const nascimento = userData.birthDate;
      const genero = userData.gender;

      console.log("Nome:", nome);
      console.log("Gênero:", genero);

      return { nome, genero, apelido, nascimento };
    } else {
      console.warn("Usuário não encontrado no Firestore.");
      return null;
    }*/
  };


  const enviar = async () => {
    try {
      //const session = await AsyncStorage.getItem('user');
      const { data, error } = await supabase.auth.getSession();
      console.log('session >>>>>>  ', data.session);
      const user = data.session?.user
      updateForm({ email: user?.email ?? '' });
      //data.email = email ?? '';


      const dadosParaEnvio = {
        ...dadosForm,
        email: user?.email ?? ''
      };

      const nomeGenero = await buscarNomeGenero();

      /* if (nomeGenero) {
         dadosParaEnvio.nome = nomeGenero.nome;
         dadosParaEnvio.genero = nomeGenero.genero;
         dadosParaEnvio.apelido = nomeGenero.apelido;
         dadosParaEnvio.nascimento = nomeGenero.nascimento;
       }*/
      //console.log('Formulário enviado com sucesso!', dadosParaEnvio);

      const response = await fetch(
        'https://n8n.softdados.com/webhook/4d114a91-60ed-4286-b2a4-f6795f562d18',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosParaEnvio), // `data` deve estar definido no seu escopo
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao enviar dados: ${response.status}`);
      }

      console.log('Formulário enviado com sucesso!', dadosParaEnvio);
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };


  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <ScrollView>
        <View style={styles.container}>

          {/* Logo */}
          <Image
            source={require('@/assets/images/logo.png')} // Substitua por sua logo
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.card}>

            <View style={styles.containerImage}>
              <Image source={require("@/assets/images/avatar-autoavaliacao.png")} style={styles.imagem} resizeMode="contain" />
            </View>

            <Text style={styles.title}>
              ✨ ✨🤩 🥳 ✨ ✨
            </Text>
            <Text style={styles.title}>
              🌱 "Cuidar de você importa (e muito)!
            </Text>

            <Text style={styles.subtitle}>
              💜 Parabéns por se permitir esse momento! Compartilhar é um passo de mudança e autocuidado. Seu bem-estar começa aqui. Obrigado(a) por confiar — estamos aqui para cuidar de você cada vez melhor.
            </Text>
          </View>

          {/* Botão próximo */}
          <TouchableOpacity
            style={[
              styles.button,
            ]}
            onPress={enviar}
          >
            <Text style={[
              styles.buttonText,
            ]}>Enviar agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PassoFinal;
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  containerRoot: {
    flex: 1,
    paddingBottom: 50
  },
  container: {
    flex: 1,
    /*backgroundColor: '#d946ef',*/
    padding: 10,
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    width: '100%', // ocupa 100% da área do container pai
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  radioCirculo: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelecionado: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#9C27B0',
  },
  button: {
    backgroundColor: '#FFA45E',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 40,
    width: width - 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerImage: {
    position: 'relative',
    width: 344,
    height: 344,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagem: {
    width: 344,
    height: 344,
  },
  opcoes: {
    width: "100%",
    marginBottom: 40,
  },
  opcao: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  opcaoSelecionada: {
    borderColor: "#6200EE",
    backgroundColor: "#E0D7F8",
  },
  opcaoTexto: {
    fontSize: 16,
  },
  numero: {
    position: 'absolute',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6B21A8', // roxo escuro
  },
  pos1: {
    left: '12%',
    bottom: 50,
  },
  pos2: {
    left: '30%',
    bottom: 40,
  },
  pos3: {
    left: '47%',
    bottom: 50,
  },
  pos4: {
    left: '63%',
    bottom: 40,
  },
  pos5: {
    left: '80%',
    bottom: 50,
  },
});

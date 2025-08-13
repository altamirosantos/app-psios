import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


const FeedbackScreen = () => {
  const [nome, setNome] = useState<string | null>(null);

  useEffect(() => {
    const buscarUsuario = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro ao buscar sessão:', error);
        return;
      }

      const user = data?.session?.user;
      console.log('session boasVindas >>>>>>  ', data.session);

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erro ao buscar perfil do usuário:', profileError.message);
          return;
        }
        setNome(profile.apelido + ',' || profile.nome + ',' || '');
      }
    };

    buscarUsuario();
  }, []);

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.card}>

            <View style={styles.containerImage}>
              <Image source={require("@/assets/images/avatar-autoavaliacao.png")} style={styles.imagem} resizeMode="contain" />
            </View>

            <View>
              <Text style={styles.title}>
                ✨ ✨🤩 🥳 ✨ ✨
              </Text>
              <Text style={styles.title}>
                Olá {nome}! Que bom ter você por aqui! Eu sou a Ana 😊
              </Text>

              <Text style={styles.subtitle}>
                Psios: Cuidar de Si com Conexão  💜
              </Text>

              <Text style={styles.subtitle}>
                É mais que um aplicativo — é um espaço acolhedor no seu celular para cuidar da mente com leveza, ciência e conexão real.
              </Text>

              <Text style={styles.subtitle}>
                Estou aqui com você nessa jornada de bem-estar emocional.
              </Text>

              <Text style={styles.subtitle}>
                Vamos dar o primeiro passo juntos?
              </Text>
            </View>
          </View>

          {/* Botão próximo */}
          <TouchableOpacity
            style={[
              styles.button,
            ]}
            onPress={() => router.push('/start-autoavaliacao')}
          >
            <Text style={[
              styles.buttonText,
            ]}>👉 Começar agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default FeedbackScreen;
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
    backgroundColor: '#E0CDFD',
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'left',
    color: '#555',
    marginVertical: 6,
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

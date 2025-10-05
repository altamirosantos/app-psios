import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';
import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';


const PassoFinal = () => {
  const { user } = useAuth();
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


  const enviar = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('session >>>>>>  ', sessionData.session);

      const userSession = sessionData?.session?.user;
      if (!userSession) return;

      // updateForm({ email: userSession.email ?? '' });


      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userSession.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil do usuário:', profileError.message);
        return;
      }

      console.log('foi')
      const respostasJSON = await gerarRespostasJSON(dadosForm);

      const dadosParaEnvio = {
        respostas: respostasJSON,
        dadosUser: {
          idUsuario: userSession.id ?? '',
          email: userSession.email ?? '',
          nome: profile?.nome ?? '',
          apelido: profile?.apelido ?? '',
          nascimento: profile?.nascimento ?? '',
          genero: profile?.genero ?? '',
        }
      };

      console.log('Dados para envio:', dadosParaEnvio);


      /* const response = await fetch(
         //'https://n8n.softdados.com/webhook/4d114a91-60ed-4286-b2a4-f6795f562d18',
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
       }*/

      const { data: webhookData, error: webhookError } = await supabase.functions.invoke("n8n-webhook-questions-psios", {
        body: dadosParaEnvio
      })

      if (webhookError) {
        console.error("Erro ao chamar webhook:", webhookError);
      } else {
        console.log("Resposta do webhook:", webhookData);
      }


      console.log('Formulário enviado com sucesso!', dadosParaEnvio);
      router.push('/(outros)/DiagnosticoScreen');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  async function gerarRespostasJSON(formContext: Record<string, any>) {
    // 1️⃣ Pega todas as chaves do formContext
    const campos = Object.keys(formContext);

    //console.log('campos >>', campos)

    // 2️⃣ Busca as perguntas correspondentes no Supabase
    const { data: perguntasData, error } = await supabase
      .from('perguntas')
      .select('nome, descricao')
      .in('nome', campos);

    if (error) throw error;

    //console.log('perguntasData >>', perguntasData)

    if (!perguntasData || perguntasData.length === 0) return [];

    // 3️⃣ Cria um mapa: chave do formContext -> descricao
    const mapaPerguntas: Record<string, { nome: string, descricao: string }> = {};
    perguntasData.forEach(p => {
      if (p.nome && p.descricao) {
        mapaPerguntas[p.nome] = {
          nome: p.nome,
          descricao: p.descricao
        };
      }
    });

    //console.log('perguntasData >>', perguntasData)

    // 4️⃣ Monta o array final com pergunta = descricao
    const resultado = campos
      .filter(c => formContext[c] !== undefined && formContext[c] !== null && formContext[c] !== '')
      .map(c => {
        const dadosPergunta = mapaPerguntas[c];

        return {
          // ✅ NOVO: Retorna o nome do campo/pergunta (p.nome)
          nome_pergunta: dadosPergunta ? dadosPergunta.nome : c,
          // Mantém a descrição da pergunta (descricao)
          descricao_pergunta: dadosPergunta ? dadosPergunta.descricao : c,
          resposta: formContext[c]
        };
      });

    return resultado;
  }


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

          <CustomButton
            title="Enviar"
            onPress={enviar}
            disabled={false}
          />

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

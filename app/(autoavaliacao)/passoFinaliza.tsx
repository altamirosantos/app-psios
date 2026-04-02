import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';
import { useForm } from '@/context/FormContext2';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { getThemeColors } from '@/theme/theme';
import { router } from 'expo-router';


const PassoFinal = () => {
  const { user } = useAuth();
  const { respostasTransformadas } = useForm();

  // 🎨 Dark Mode
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const enviar = async () => {
    try {
      if (!respostasTransformadas) {
        console.error('Nenhuma resposta transformada disponível');
        return;
      }

      console.log('Enviando respostas transformadas:', respostasTransformadas);

      // 🔥 Enviar as respostas que foram preparadas em PassoScreen
      const { data: webhookData, error: webhookError } = await supabase.functions.invoke("n8n-webhook-questions-psios2", {
        body: respostasTransformadas
      })

      if (webhookError) {
        console.error("Erro ao chamar webhook:", webhookError);
      } else {
        console.log("Resposta do webhook:", webhookData);
      }

      console.log('Formulário enviado com sucesso!', respostasTransformadas);
      router.push('/(outros)/DiagnosticoScreen');
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
          <View style={[styles.card, dynamicStyles.card]}>

            <View style={styles.containerImage}>
              <Image source={require("@/assets/images/avatar-autoavaliacao.png")} style={styles.imagem} resizeMode="contain" />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              ✨ ✨🤩 🥳 ✨ ✨
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              🌱 "Cuidar de você importa (e muito)!
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
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

// 🎨 Factory function para criar estilos dinâmicos baseados no tema
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  card: {
    backgroundColor: colors.cardBackground,
    shadowColor: colors.text,
    shadowOpacity: 0.1,
  },
});

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

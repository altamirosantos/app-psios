import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Checkbox } from 'react-native-paper';

import { CustomButton } from '@/components/CustomButton';
import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';



const Passo4 = () => {
  const { updateForm, dadosForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const inputBg = useThemeColor('inputBackground');
  const [selectedItemsPasso6, setSelectedItemsPasso6] = useState<string[]>([]);
  const [outroTexto, setOutroTexto] = useState('');




  const emotionalFactors = [
    "Estresse no trabalho ou estudos.",
    "Conflitos familiares ou relacionamentos.",
    "Preocupações financeiras.",
    "Problemas de saúde física.",
    "Solidão ou isolamento",
    "Práticas espirituais ou de gratidão",
    "Expectativas altas sobre si",
    "Luto.",
    "Sentir que estou evoluindo pessoalmente",
    "Falta de tempo para si",
    "Mudanças climáticas",
    "Dormir melhor ou descansar mais",
    "Prática de atividades físicas",
    "Nenhum",
    "Outro"
  ];

  const [nome, setNome] = useState<string | null>(null);

  useEffect(() => {
    const buscarUsuario = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro ao buscar sessão:', error);
        return;
      }

      const user = data?.session?.user;
      console.log('session >>>>>>  ', data.session);

      if (user) {
        // const nomeUsuario = user.user_metadata?.full_name || user.email || 'Usuário';

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

  const { loading } = useAuthGuard();
  if (loading) {
    console.log('loading...', nome);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const toggleItem = (opcao: string) => {
    if (opcao === "Nenhum") {
      setSelectedItemsPasso6(["Nenhum"]);
      setOutroTexto("");
    } else {

      let novasOpcoes = selectedItemsPasso6.filter(item => item !== "Nenhum");

      // let novaSelecao = [...selectedItemsPasso6];

      if (novasOpcoes.includes(opcao)) {
        // Desmarca a opção
        novasOpcoes = novasOpcoes.filter(item => item !== opcao);
        if (opcao === "Outro") setOutroTexto("");
      } else {
        // Marca a opção
        novasOpcoes.push(opcao);
      }

      setSelectedItemsPasso6(novasOpcoes);
    }
  };


  const handleNext = () => {
    let itemsToSend = [...selectedItemsPasso6];

    // Se tiver texto digitado em "outro", substitui o literal "Outros"
    if (outroTexto.trim() !== "") {
      itemsToSend = itemsToSend.map(item =>
        item === "Outro" ? outroTexto.trim() : item
      );
    }

    updateForm({ passo04Pergunta1: itemsToSend });
    console.log("Dados Form: ", itemsToSend);
    router.push('/passo5');
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
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: textColor }]}>
                🌀 {nome} Seu bem-estar é influenciado por alguns desses fatores agora? Identifique.
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: textColor }]}>Marque as opções que se aplicam:</Text>
            {emotionalFactors.map((item, index) => (
              <View
                key={index}
                style={[styles.checkboxContainer, { backgroundColor: inputBg }]}
              >
                <Checkbox
                  status={selectedItemsPasso6.includes(item) ? 'checked' : 'unchecked'}
                  onPress={() => toggleItem(item)}
                />
                <Text style={[styles.checkboxLabel, { color: textColor }]}>{item}</Text>
              </View>
            ))}

            {/* Se "Outro" estiver selecionado, exibe campo de texto */}
            {selectedItemsPasso6.includes('Outro') && (
              <TextInput
                style={[styles.inputOutro, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Digite aqui..."
                placeholderTextColor="#999"
                value={outroTexto}
                onChangeText={(texto) => {
                  setOutroTexto(texto);

                  if (!selectedItemsPasso6.includes("Outro")) {
                    // Garante que "Outro" fique selecionado ao digitar
                    setSelectedItemsPasso6(prev => [...prev.filter(item => item !== "Nenhum"), "Outro"]);
                  }
                  /* setSelectedItemsPasso6((prev) => {
                     const semOutro = prev.filter((i) => i !== "Outro");
                     if (texto.trim() !== "") {
                       return [...semOutro, texto.trim()];
                     }
                     return semOutro; // Se apagou o texto, apenas remove "Outro"
                   });*/
                }}
              />
            )}

          </View>

          <CustomButton
            title="Próximo..."
            onPress={handleNext}
            disabled={selectedItemsPasso6.length === 0}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo4;
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
    width: '100%', // ocupa 100% da área do container pai
    maxWidth: 400,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  opcaoTexto: {
    fontSize: 16,
    color: '#333',
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
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  sliderValueContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 2,
  },
  sliderValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  labelContainer: {
    alignItems: 'center',
    flex: 1,
  },
  labelValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  labelText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap'
  },
  checkboxList: {
    maxHeight: 300 // ou remova se quiser scroll infinito
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333'
  },
  inputOutro: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 14
  }
});

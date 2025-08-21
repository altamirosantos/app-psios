import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { useForm } from '@/context/FormContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { Checkbox } from 'react-native-paper';




const Passo5 = () => {
  const { updateForm, dadosForm } = useForm();

  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  //const [oque, setOque] = useState('');
  //const [sentimento, setSentimento] = useState('');
  const [comoSeComportou, setComoSeComportou] = useState<string[]>([]);
  //const [gatilho, setGatilho] = useState('');
  //const [pensamento, setPensamento] = useState('');

  const [selecionadoOpCard1, setSelecionadoOpCard1] = useState<string | null>(null);
  const [selecionadoOpCard2, setSelecionadoOpCard2] = useState<string | null>(null);
  const [selecionadoOpCard3, setSelecionadoOpCard3] = useState<string | null>(null);
  const [selecionadoOpCard4, setSelecionadoOpCard4] = useState<string | null>(null);

  const [outroTextoCard1, setOutroTextoCard1] = useState("");
  const [outroTextoCard2, setOutroTextoCard2] = useState("");
  const [outroTextoCard3, setOutroTextoCard3] = useState("");
  const [outroTextoCard4, setOutroTextoCard4] = useState("");
  const [outroComportamento, setOutroComportamento] = useState("");


  const opCard1 = [
    'Sozinho(a) no quarto',
    'Conversando com alguém',
    'Recebendo uma mensagem',
    'Chegando ou saindo de casa',
    'No trabalho / estudando',
    'Em uma situação difícil'
  ];

  const opCard2 = [
    'Uma crítica ou julgamento',
    'Um silêncio ou afastamento',
    'Uma lembrança desconfortável',
    'Uma cobrança ou pressão',
    'Um conflito ou discussão',
    'Um medo interno'
  ];

  const opCard3 = [
    '“Eu não sou bom o suficiente”',
    '“Tudo vai dar errado”',
    '“Eu atrapalho as pessoas”',
    '“Ninguém se importa comigo”',
    '“Não vou conseguir lidar com isso”',
    '“Sempre estrago tudo”',
    '"Uma preocupação com o futuro"',
    '"Um medo de julgamento"'
  ];

  const opCard4 = [
    'Senti abertura no peito ou nó na garganta',
    'Fiquei com o corpo tenso ou acelerado',
    'Senti cansaço arrependido ou vontade de dormir',
    'Tive vontade de sair correndo ou sumir',
    'Nenhuma ocorrência física percebida'
  ];


  const comportamentoOptions = [
    "Me afastei de tudo e de todos",
    "Fiquei paralisado(a), sem saber o que fazer",
    "Falei ou agi de forma impulsiva",
    "Chorei ou tive vontade de chorar",
    "Busquei alguma distração (TV, celular, comida etc.)",
    "Procurei alguém para conversar",
    "Respirei fundo e tentei me entusiasmado",
    "Outros"
  ];


  const { loading } = useAuthGuard();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const toggleComportamento = (option: string) => {
    setComoSeComportou(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    // Substitui "Outros" pelo texto correspondente, caso tenha sido digitado
    const finalCard1 =
      selecionadoOpCard1 === "Outros" && outroTextoCard1.trim() !== ""
        ? outroTextoCard1.trim()
        : selecionadoOpCard1 || "";

    const finalCard2 =
      selecionadoOpCard2 === "Outros" && outroTextoCard2.trim() !== ""
        ? outroTextoCard2.trim()
        : selecionadoOpCard2 || "";

    const finalCard3 =
      selecionadoOpCard3 === "Outros" && outroTextoCard3.trim() !== ""
        ? outroTextoCard3.trim()
        : selecionadoOpCard3 || "";

    const finalCard4 =
      selecionadoOpCard4 === "Outros" && outroTextoCard4.trim() !== ""
        ? outroTextoCard4.trim()
        : selecionadoOpCard4 || "";

    // Ajusta lista de comportamentos
    const finalComportamento: any[] = comoSeComportou
      .map(item => {
        if (item === "Outros") {
          // Se marcou "Outros" e digitou algo, usa o texto digitado
          if (outroComportamento.trim() !== "") {
            return outroComportamento.trim();
          }
          // Se marcou "Outros" mas não digitou nada, ignora
          return null;
        }
        return item;
      })
      .filter(Boolean); // remove nulls

    updateForm({
      passo05Pergunta1: finalCard1,
      passo05Pergunta2: finalCard2,
      passo05Pergunta3: finalCard3,
      passo05Pergunta4: finalComportamento,
      passo05Pergunta5: finalCard4
    });

    console.log("dadosForm atualizado", {
      passo8Oque: finalCard1,
      passo8Sentimento: finalCard4,
      passo8ComoSeComportou: finalComportamento,
      passo8Gatilho: finalCard2,
      passo8Pensamento: finalCard3
    });

    router.push('/passo6');
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
            <Text style={[styles.title, { color: textColor }]}>📝 Seu bem-estar é importante! Vamos olhar juntos para o que você sente e o que se passa na sua mente.</Text>
            <Text style={[styles.subsubtitle, { color: textColor }]}>Preencha abaixo de forma breve e sincera.</Text>

          </View>
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>📌 Situação</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>Onde você estava ou o que estava acontecendo?</Text>
            <Text style={[styles.subsubtitle, { color: textColor }]}>(Escolha uma ou mais opções)</Text>
            {opCard1.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.opcao,
                  selecionadoOpCard1 === item && { backgroundColor: inputBg }
                ]}
                onPress={() => {
                  setSelecionadoOpCard1(item);
                  if (item !== "Outros") {
                    setOutroTextoCard1(""); // limpa campo se não for outros
                  }
                }}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard1 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}

            {/* Campo de "Outros" */}
            <TouchableOpacity
              style={[
                styles.opcao,
                selecionadoOpCard1 === "Outros" && { backgroundColor: inputBg }
              ]}
              onPress={() => setSelecionadoOpCard1("Outros")}
            >
              <View style={styles.radioCirculo}>
                {selecionadoOpCard1 === "Outros" && <View style={styles.radioSelecionado} />}
              </View>
              <Text style={[styles.opcaoTexto, { color: textColor }]}>Outros</Text>
            </TouchableOpacity>

            {/* Campo para digitar se for "Outros" */}
            {selecionadoOpCard1 === "Outros" && (
              <TextInput
                style={styles.inputOutros}
                placeholder="Digite aqui..."
                placeholderTextColor="#999"
                value={outroTextoCard1}
                onChangeText={setOutroTextoCard1}
              />
            )}
          </View>
          <View style={[styles.card, { backgroundColor: cardColor }]}>

            <Text style={[styles.title, { color: textColor }]}>⚡ Gatilho</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>O que parece ter ativado esse sentimento?</Text>
            <Text style={[styles.subsubtitle, { color: textColor }]}>(Escolha uma opção)</Text>
            {opCard2.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard2 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard2(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard2 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}

            {/* Campo de "Outros" */}
            <TouchableOpacity
              style={[
                styles.opcao,
                selecionadoOpCard2 === "Outros" && { backgroundColor: inputBg }
              ]}
              onPress={() => setSelecionadoOpCard2("Outros")}
            >
              <View style={styles.radioCirculo}>
                {selecionadoOpCard2 === "Outros" && <View style={styles.radioSelecionado} />}
              </View>
              <Text style={[styles.opcaoTexto, { color: textColor }]}>Outros</Text>
            </TouchableOpacity>

            {/* Campo para digitar se for "Outros" */}
            {selecionadoOpCard2 === "Outros" && (
              <TextInput
                style={styles.inputOutros}
                placeholder="Digite aqui..."
                placeholderTextColor="#999"
                value={outroTextoCard2}
                onChangeText={setOutroTextoCard2}
              />
            )}

          </View>
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>💭 Pensamento</Text>
            <Text style={[styles.subtitle, { color: textColor }]}>O que passou pela sua cabeça? — O pensamento que mais tem ocupado sua mente</Text>
            <Text style={[styles.subsubtitle, { color: textColor }]}>(Escolha a frase que mais se parece com o que inventou)</Text>
            {opCard3.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard3 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard3(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard3 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}

            {/* Campo de "Outros" */}
            <TouchableOpacity
              style={[
                styles.opcao,
                selecionadoOpCard3 === "Outros" && { backgroundColor: inputBg }
              ]}
              onPress={() => setSelecionadoOpCard3("Outros")}
            >
              <View style={styles.radioCirculo}>
                {selecionadoOpCard3 === "Outros" && <View style={styles.radioSelecionado} />}
              </View>
              <Text style={[styles.opcaoTexto, { color: textColor }]}>Outros</Text>
            </TouchableOpacity>

            {/* Campo para digitar se for "Outros" */}
            {selecionadoOpCard3 === "Outros" && (
              <TextInput
                style={styles.inputOutros}
                placeholder="Digite aqui..."
                placeholderTextColor="#999"
                value={outroTextoCard3}
                onChangeText={setOutroTextoCard3}
              />
            )}

          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <View style={styles.radioContainer}>
              <Text style={[styles.title, { color: textColor }]}>🧍‍♂️ Comportamento (ações)</Text>
              <Text style={[styles.subtitle, { color: textColor }]}>🔁 Como você reagiu naquele momento?</Text>
              <Text style={[styles.subsubtitle, { color: textColor }]}>Pense em como você agiu ou se sentiu logo após o pensamento que surgiu. Escolha uma ou mais reações que mais se aproximem da sua experiência:</Text>
              <View style={styles.radioGrid}>
                {comportamentoOptions.map((option, index) => (
                  <View
                    key={index}
                    style={[
                      styles.radioItem,
                      option === "Outros"
                        ? { flexDirection: "column", alignItems: "flex-start", width: "100%" }
                        : {}
                    ]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Checkbox
                        status={comoSeComportou.includes(option) ? "checked" : "unchecked"}
                        onPress={() => toggleComportamento(option)}
                      />
                      <Text
                        style={[styles.label, { color: textColor }]}
                        onPress={() => toggleComportamento(option)}
                      >
                        {option}
                      </Text>
                    </View>

                    {option === "Outros" && comoSeComportou.includes("Outros") && (
                      <TextInput
                        style={{
                          marginTop: 6,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          width: "100%", // ocupa toda a área disponível
                          backgroundColor: inputBg,
                        }}
                        placeholder="Digite aqui..."
                        value={outroComportamento}
                        onChangeText={setOutroComportamento}
                      />
                    )}
                  </View>

                ))}
              </View>
            </View>

          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>💓 Corpo (reações físicas)</Text>
            {opCard4.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcao, selecionadoOpCard4 === item && { backgroundColor: inputBg }]}
                onPress={() => setSelecionadoOpCard4(item)}
              >
                <View style={styles.radioCirculo}>
                  {selecionadoOpCard4 === item && <View style={styles.radioSelecionado} />}
                </View>
                <Text style={[styles.opcaoTexto, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}

            {/* Campo de "Outros" */}
            <TouchableOpacity
              style={[
                styles.opcao,
                selecionadoOpCard4 === "Outros" && { backgroundColor: inputBg }
              ]}
              onPress={() => setSelecionadoOpCard4("Outros")}
            >
              <View style={styles.radioCirculo}>
                {selecionadoOpCard4 === "Outros" && <View style={styles.radioSelecionado} />}
              </View>
              <Text style={[styles.opcaoTexto, { color: textColor }]}>Outros</Text>
            </TouchableOpacity>

            {/* Campo para digitar se for "Outros" */}
            {selecionadoOpCard4 === "Outros" && (
              <TextInput
                style={styles.inputOutros}
                placeholder="Digite aqui..."
                placeholderTextColor="#999"
                value={outroTextoCard4}
                onChangeText={setOutroTextoCard4}
              />
            )}

          </View>

          <CustomButton
            title="Próximo..."
            onPress={handleNext}
            disabled={!selecionadoOpCard1 || comoSeComportou.length === 0 || !selecionadoOpCard2 || !selecionadoOpCard3 || !selecionadoOpCard4}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Passo5;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  radioContainer: {
    marginBottom: 16,
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
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'left',
    marginVertical: 0,
    fontWeight: 'bold',
  },
  subsubtitle: {
    fontSize: 14,
    textAlign: 'left',
    marginVertical: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagSelected: {
    backgroundColor: '#6366f1',
  },
  tagText: {
    color: '#333',
  },
  tagTextSelected: {
    color: '#fff',
  },
  sliderValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    textAlignVertical: 'top',
    minHeight: 60,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerNote: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    marginBottom: 40,
    paddingHorizontal: 20,
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
  radioGrid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  opcaoTexto: {
    fontSize: 16,
    color: '#333',
    marginEnd: 20,
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
  inputOutros: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    width: "100%",
    backgroundColor: "#fff",
    color: "#333"
  },
  outrosInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    fontSize: 14,
    backgroundColor: "#fff"
  }
});

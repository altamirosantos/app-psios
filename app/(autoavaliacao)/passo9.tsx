import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Checkbox } from 'react-native-paper';


const distorcoes = [
  {
    titulo: 'Leitura mental',
    descricao: 'Acho que sei o que os outros estão pensando sobre mim.',
  },
  {
    titulo: 'Catastrofização',
    descricao: 'Sempre imagino o pior cenário possível.',
  },
  {
    titulo: 'Tudo ou nada',
    descricao: 'Se não for perfeito, é um fracasso.',
  },
  {
    titulo: 'Generalização',
    descricao: 'Sempre que algo dá errado, penso que tudo sempre será assim.',
  },
  {
    titulo: 'Filtro negativo',
    descricao: 'Só consigo ver o lado ruim da situação.',
  },
  {
    titulo: 'Desqualificar o positivo',
    descricao: 'Esqueço ou minimizo as coisas boas que acontecem.',
  },
  {
    titulo: 'Rotação',
    descricao: 'Eu não sou boa o suficiente.',
  },
  {
    titulo: 'Personalização',
    descricao: 'Sinto que tudo é culpa minha.',
  },
];

const FeedbackScreen = () => {
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const toggleItem = (titulo: string) => {
    setSelecionados(prev =>
      prev.includes(titulo) ? prev.filter(i => i !== titulo) : [...prev, titulo]
    );
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
            <Text style={styles.title}>
              💗 <Text style={{ fontWeight: 'bold' }}>Seu pensamento contém alguma dessas distorções?</Text> Marque as opções que se aplicam:
            </Text>

            <View style={styles.lista}>
              {distorcoes.map((item, idx) => (
                <View key={idx} style={styles.item}>
                  <Checkbox
                    status={selecionados.includes(item.titulo) ? 'checked' : 'unchecked'}
                    onPress={() => toggleItem(item.titulo)}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitulo}>{item.titulo}</Text>
                    <Text style={styles.itemDescricao}>{item.descricao}</Text>
                  </View>
                </View>
              ))}
            </View>

          </View>

          {/* Botão próximo */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/passo10')}
          >
            <Text style={styles.buttonText}>Me conte mais...</Text>
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
    backgroundColor: '#fff',
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
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
    backgroundColor: '#4F46E5',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  }, lista: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  itemDescricao: {
    fontSize: 13,
    color: '#555',
  },
});

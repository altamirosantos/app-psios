import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Route, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuthGuard } from '../../hooks/useAuthGuard';

const data = [
  { id: '1', label: 'Favoritos', icon: <FontAwesome name="heart" size={28} color="#f47c57" />, premium: true },
  { id: '2', label: 'Notificações', icon: <Feather name="bell" size={28} color="#4a00e0" />, premium: false },
  { id: '3', label: 'Profile', icon: <Feather name="user" size={28} color="#f47c57" />, premium: false, route: '/(outros)/ProfileScreen' },
  { id: '4', label: 'Assinaturas', icon: <Feather name="shopping-cart" size={28} color="#4a00e0" />, premium: false, route: '/(tabs)/assinatura' },
  { id: '5', label: 'Agenda', icon: <Feather name="calendar" size={28} color="#00c6ff" />, premium: false, route: '/(outros)/AgendaScreen' },
  { id: '6', label: 'Chat', icon: <Feather name="message-square" size={28} color="#f47c57" />, premium: false, route: '/(outros)/ChatScreen' },
  { id: '7', label: 'Dirio de Emoções', icon: <Feather name="book-open" size={28} color="#00c6ff" />, premium: false, route: '/(outros)/DiarioEmocoesScreen' },
  { id: '8', label: 'Sono e Relaxamento', icon: <Feather name="moon" size={28} color="#00c6ff" />, premium: false, route: '/(outros)/SonoRelaxamentoScreen' },
  { id: '9', label: 'Relatórios de bem-estar', icon: <Feather name="bar-chart-2" size={28} color="#00c6ff" />, premium: false, route: '/(outros)/RelatoriosBemEstarScreen' },
  { id: '10', label: 'Gamificação', icon: <Feather name="award" size={28} color="#00c6ff" />, premium: false, route: '/(outros)/GamificacaoScreen' },
  { id: '11', label: 'Recursos de Apoio', icon: <FontAwesome name="flag" size={28} color="#00c6ff" />, premium: false, route: '/(outros)/RecursosApoioScreen' },

];

const numColumns = 3;
const size = Dimensions.get('window').width / numColumns - 60;

export default function DashboardScreen() {
  const { loading } = useAuthGuard();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const isPremiumUser = false;

  const openModal = (featureName: string) => {
    setSelectedFeature(featureName);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFeature(null);
  };

  const goToSubscription = () => {

    router.push('/(tabs)/assinatura');
    closeModal();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9333ea', '#d763f8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.welcome}>Seja bem-vindo(a)</Text>
        <Text style={styles.subtitle}>
          Pronto (a) para transformar sua vida? Mude a forma de pensar, sentir e agir com novas conexões e autoconsciência.
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Acesso rápido</Text>

        <View style={styles.grid}>
          {data.map((item) => {
            const disabled = item.premium && !isPremiumUser;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, disabled && styles.cardDisabled]}
                disabled={false}
                onPress={() => {
                  if (disabled) {
                    openModal(item.label);
                    return;
                  }
                  console.log(`Acessando: ${item.route}`);
                  const route: Route = item.route || "/(tabs)/home";
                  router.push(route);
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  {item.icon}
                  <Text style={[styles.cardLabel, disabled && styles.cardLabelDisabled]}>
                    {item.label}
                    {item.premium && (
                      <MaterialCommunityIcons
                        name="lock"
                        size={14}
                        color="#e91e63"
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.legend}>* Funções disponíveis apenas no plano pago</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/start-autoavaliacao')}
        >
          <Text style={styles.buttonText}>Começar minha autoavaliação</Text>
        </TouchableOpacity>

        {/* <Text style={styles.recent}>Atividade Recente</Text> */}
      </ScrollView>

      {/* Modal de Assinatura */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recurso Premium</Text>
            <Text style={styles.modalText}>
              A função <Text style={{ fontWeight: 'bold' }}>{selectedFeature}</Text> está disponível apenas no plano premium.
            </Text>
            <Text style={styles.modalPrice}>A partir de R$ 9,90/mês</Text>

            <TouchableOpacity style={styles.subscribeButton} onPress={goToSubscription}>
              <Text style={styles.subscribeButtonText}>Assinar agora</Text>
            </TouchableOpacity>

            <Pressable onPress={closeModal}>
              <Text style={styles.modalCancel}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f9',
    alignItems: 'center',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  card: {
    width: size,
    height: size,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardDisabled: {
    backgroundColor: '#e4e4e4',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  cardLabelDisabled: {
    color: '#888',
  },
  premiumLabel: {
    color: '#e91e63',
    fontWeight: 'bold',
    fontSize: 12,
  },
  legend: {
    fontSize: 12,
    color: '#e91e63',
    marginBottom: 10,
    textAlign: 'center',
  },
  recent: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFA45E',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 40,
    width: width - 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 50,
    paddingTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9333ea',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a00e0',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#9333ea',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancel: {
    color: '#777',
    fontSize: 14,
    marginTop: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    height: 60
  }
});

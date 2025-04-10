import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthGuard } from '../hooks/useAuthGuard';

const data = [
  { id: '1', label: 'Home', icon: <Feather name="home" size={28} color="#4a00e0" /> },
  { id: '2', label: 'Search', icon: <Feather name="search" size={28} color="#00c6ff" /> },
  { id: '3', label: 'Favorites', icon: <FontAwesome name="heart" size={28} color="#f47c57" /> },
  { id: '4', label: 'Notifications', icon: <Feather name="bell" size={28} color="#4a00e0" /> },
  { id: '5', label: 'Settings', icon: <Feather name="settings" size={28} color="#00c6ff" /> },
  { id: '6', label: 'Profile', icon: <Feather name="user" size={28} color="#f47c57" /> },
  { id: '7', label: 'Shop', icon: <Feather name="shopping-cart" size={28} color="#4a00e0" /> },
  { id: '8', label: 'Calendar', icon: <Feather name="calendar" size={28} color="#00c6ff" /> },
  { id: '9', label: 'Messages', icon: <Feather name="message-square" size={28} color="#f47c57" /> },
];

const numColumns = 3;
const size = Dimensions.get('window').width / numColumns - 30;

export default function DashboardScreen() {
  const { loading } = useAuthGuard();
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
        <Text style={styles.welcome}>Seja bem-vindo(a)</Text>
        <Text style={styles.subtitle}>
          Pronto (a) para transformar sua vida? Mude a forma de pensar, sentir e agir com novas conexões e autoconsciência.
        </Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Acesso rápido</Text>

      <FlatList
        data={data}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            {item.icon}
            <Text style={styles.cardLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.recent}>Atividade Recente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f9',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    /*borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,*/
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
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  grid: {
    paddingHorizontal: 15,
  },
  card: {
    width: size,
    height: size,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
  },
  recent: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  alert('renderizou');
  const router = useRouter();

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        console.log('Verificando login...');
        const user = await AsyncStorage.getItem('user');
        if (user) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
        // Opcional: redirecionar para uma tela de erro ou login seguro
        router.replace('/(auth)/login');
      }
    };
  
    verificarLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

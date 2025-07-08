import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export function useAuthGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarLogin = async () => {
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        router.replace('/(auth)/login');
      }else{
        setLoading(false);
      }
    };

    verificarLogin();
  }, []);
  return { loading };
}

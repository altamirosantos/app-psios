import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';


export default function Index() {
  //alert('renderizou')
  const router = useRouter();

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        console.log('Sessão atual:', data);

        if (data.session && data.session.user) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Erro ao verificar sessão Supabase:', error);
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

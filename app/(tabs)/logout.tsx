import { logout } from '@/app/services/auth.service';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Executa logout assim que o usuário acessar a aba
    logout();
    router.replace('/(auth)/login'); // ou onde estiver sua tela de login
  }, []);

  return null;
}
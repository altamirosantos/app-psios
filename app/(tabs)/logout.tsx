import { logout } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await logout(); // espera o logout ser concluído
      router.replace('/(auth)/login'); // só redireciona depois
    };

    handleLogout();
  }, []);

  return null;
}

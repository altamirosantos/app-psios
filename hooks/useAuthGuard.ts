// src/hooks/useAuthGuard.ts
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export function useAuthGuard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro ao buscar sessão:', error.message);
        router.replace('/(auth)/login');
        return;
      }

      //console.log('Sessão atual(useAuthGuard): ', data);

      if (!data.session || !data.session.user) {
        console.log('Usuário não autenticado. Redirecionando para login...');
        router.replace('/(auth)/login');
      }

      setLoading(false);
    };

    checkSession();

    // Atualiza caso o estado de auth mude (logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/(auth)/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { loading };
}

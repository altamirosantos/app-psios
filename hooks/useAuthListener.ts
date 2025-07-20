import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

export function useAuthListener(onLogin: () => void) {
    useEffect(() => {
        const listener = Linking.addEventListener('url', async ({ url }) => {
            // Esse evento é disparado quando o app recebe um deep link (ex: login-callback)
            console.log('Deep link recebido:', url);

            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Erro ao buscar sessão:', error.message);
                return;
            }

            if (data.session) {
                console.log('Login finalizado com sucesso!');
                onLogin(); // aqui você pode redirecionar, ex: router.push("/home")
            }
        });

        return () => {
            listener.remove();
        };
    }, []);
}

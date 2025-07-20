import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

type UserProfile = {
    id: string;
    email: string;
    nome: string;
    apelido?: string;
    nascimento?: string;
    genero?: string;
};

type AuthContextType = {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    // 🔄 Listener de deep link (OAuth)
    useEffect(() => {
        const handleDeepLink = async ({ url }: { url: string }) => {
            const { data, error } = await supabase.auth.exchangeCodeForSession(url);
            if (error) {
                console.error('Erro ao trocar código por sessão:', error.message);
                return;
            }

            const userSession = data?.session?.user;
            if (!userSession) return;

            // Busca perfil
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userSession.id)
                .single();

            if (profileError) {
                console.error('Erro ao buscar perfil do usuário:', profileError.message);
                return;
            }

            setUser({
                id: userSession.id,
                email: userSession.email ?? '',
                nome: profile.nome,
                apelido: profile.apelido,
                nascimento: profile.nascimento,
                genero: profile.genero,
            });

            // Redirecionar para tela principal
            router.replace('/boasVindas');
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

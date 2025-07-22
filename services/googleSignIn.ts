import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../lib/supabase';

GoogleSignin.configure({
    webClientId: '885012723816-sacca04qrrcuokn4knjj4v9ut93ujii0.apps.googleusercontent.com', // do tipo Web
    offlineAccess: true,
});

export async function signInWithGoogle() {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        const { idToken } = await GoogleSignin.getTokens();
        if (!idToken) throw new Error('ID Token ausente');

        // Login com Supabase usando o ID Token do Google
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Erro login Google:', err);
        throw err;
    }
}

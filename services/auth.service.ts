import { supabase } from '@/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId: '885012723816-sacca04qrrcuokn4knjj4v9ut93ujii0.apps.googleusercontent.com', // do tipo Web
  offlineAccess: true,
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    console.log('Google Play Services disponíveis');
    const userInfo = await GoogleSignin.signIn();

    console.log('Login com Google iniciado:', userInfo);

    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error('ID Token ausente');

    console.log('ID Token:', idToken);

    // Login com Supabase usando o ID Token do Google
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro login Google (auth.service):', err);
    throw err;
  }
}


export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro ao logar:', error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: 'com.altamirosantos.apppsios://auth/callback', // para mobile
    },
  });

  if (error) {
    console.error('Erro ao logar com Facebook:', error.message);
  } else {
    console.log('Login com Facebook iniciado:', data);
  }
}

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    //await AsyncStorage.clear(); // ou AsyncStorage.removeItem('user') se preferir
  } catch (e) {
    console.error('Erro ao fazer logout:', e);
  }
};

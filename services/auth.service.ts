import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    await AsyncStorage.clear(); // ou AsyncStorage.removeItem('user') se preferir
  } catch (e) {
    console.error('Erro ao fazer logout:', e);
  }
};

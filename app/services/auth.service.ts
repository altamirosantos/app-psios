import { auth } from '@/lib/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
// Se usar AsyncStorage, ative essa linha abaixo
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Se quiser salvar algum token ou info localmente:
    // await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));

    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);

    // Apagar dados locais se estiver usando AsyncStorage ou SecureStore
    // await AsyncStorage.removeItem('user');
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error.message);
  }
};

//import { saveUserToApi } from '@/lib/api';
import { auth, db } from '@/lib/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

interface ExtraData {
  nome: string;
  apelido: string;
  nascimento: Date;
  genero: string;
}

export const registerUser = async (email: string, password: string, extraData: ExtraData) => {
  try {
    // 1. Cria usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Cria documento no Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      fullName: extraData.nome,
      nickname: extraData.apelido,
      birthDate: extraData.nascimento.toISOString(),
      gender: extraData.genero,
      createdAt: new Date().toISOString()
    });

    return uid;
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};
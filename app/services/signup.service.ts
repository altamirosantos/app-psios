import { saveUserToApi } from '@/lib/api';
import { auth } from '@/lib/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export async function registerUser(
  email: string,
  password: string,
  extraData: {
    nome: string;
    apelido: string;
    nascimento: Date;
  }
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await saveUserToApi({
    uid,
    email,
    fullName: extraData.nome,
    nickname: extraData.apelido,
    birthDate: extraData.nascimento.toISOString(),
  });

  return userCredential;
}
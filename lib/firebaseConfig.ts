import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_DOMINIO.firebaseapp.com',
  projectId: 'SEU_PROJETO',
  storageBucket: 'SEU_BUCKET.appspot.com',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: 'SEU_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
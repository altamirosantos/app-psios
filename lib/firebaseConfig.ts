import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyByJaDPvlcQMsiBdaqvvNvXKyMrpwvhAf0',
  authDomain: 'br.com.psios.firebaseapp.com',
  projectId: 'psios-fb9b7',
  storageBucket: 'SEU_BUCKET.appspot.com',
  messagingSenderId: 'SEU_SENDER_ID',
  appId: '885012723816',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

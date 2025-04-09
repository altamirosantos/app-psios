import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAFfLORsWcuh8K8-284_fAobUnJvJR1ni4',
  authDomain: 'psios-fb9b7.firebaseapp.com',
  projectId: 'psios-fb9b7',
  storageBucket: 'psios-fb9b7.appspot.com',
  messagingSenderId: '885012723816',
  appId: '1:885012723816:web:366459896b68aeb585e3dd',
  measurementId: "G-SJYHQBTSZL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

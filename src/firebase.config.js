// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCGVCdUygyExJBpP0pJ60I4Hme5D_c8Q3o',
  authDomain: 'barky-buddies.firebaseapp.com',
  projectId: 'barky-buddies',
  storageBucket: 'barky-buddies.appspot.com',
  messagingSenderId: '65686957953',
  appId: '1:65686957953:web:67e76072142609d76d4280',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

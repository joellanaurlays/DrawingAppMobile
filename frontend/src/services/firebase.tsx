import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore -- Force le passage si les types Firebase v10+ ne sont pas synchronisés localement
import { getReactNativePersistence } from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDrjz4Fg5HyVXoQUAQxlscyFsb9ofnBu_A",
  authDomain: "drawingapp-24219.firebaseapp.com",
  projectId: "drawingapp-24219",
  storageBucket: "drawingapp-24219.firebasestorage.app",
  messagingSenderId: "599867364095",
  appId: "1:599867364095:web:8118824e6f78bff27632ca",
  measurementId: "G-9GRZ70QNE7"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
export { auth, db };
import { initializeApp } from 'firebase/app';

import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, initializeAuth, getReactNativePersistence } from "firebase/auth";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'spotify-games.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'spotify-games',
  storageBucket: 'spotify-games.appspot.com',
  messagingSenderId: '16243974718',
  appId: '1:16243974718:web:d69ba35a2d588a91d9276f',
  measurementId: 'G-V06PHVMN3L',
};

const app = initializeApp(firebaseConfig);

// const auth = getAuth();
// might want to revert the persisted version for testing, since this automatically signs in the user if they have a login stored
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, firebaseConfig, app }
// const analytics = getAnalytics(app);
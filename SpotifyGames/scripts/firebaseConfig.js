import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4fmzBG3QrFzsqz_jf-Zu-S94lQk3FWUs",
  authDomain: "group11-8368c.firebaseapp.com",
  databaseURL: "https://group11-8368c-default-rtdb.firebaseio.com",
  projectId: "group11-8368c",
  storageBucket: "group11-8368c.appspot.com",
  messagingSenderId: "589132747393",
  appId: "1:589132747393:web:1ccd2c1053702d301e3380",
  measurementId: "G-J4P3HWXMQJ"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const auth = Platform.OS === "web" ? getAuth() : initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// might want to revert the persisted version for testing, since this automatically signs in the user if they have a login stored

export { auth, firebaseConfig, app, db }
// const analytics = getAnalytics(app);
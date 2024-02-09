import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


// .env file configuration
// TODO add react-native-dotenv to plugins
// https://www.npmjs.com/package/react-native-dotenv
import {FIREBASE_API_KEY} from "@env";



// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'spotify-games.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'spotify-games',
  storageBucket: 'spotify-games.appspot.com',
  messagingSenderId: '16243974718',
  appId: '1:16243974718:web:d69ba35a2d588a91d9276f',
  measurementId: 'G-V06PHVMN3L',
};

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
// expo+firebase docs: https://rnfirebase.io/#expo

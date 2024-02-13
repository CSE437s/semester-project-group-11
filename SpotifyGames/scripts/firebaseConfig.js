import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";


// .env file configuration
// TODO add react-native-dotenv to plugins
// https://www.npmjs.com/package/react-native-dotenv




// Optionally import the services that you want to use
// import {...} from "firebase/auth";
import {getDatabase, ref, set} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'spotify-games.firebaseapp.com',
  databaseURL: 'https://group11-8368c-default-rtdb.firebaseio.com',
  projectId: 'spotify-games',
  storageBucket: 'spotify-games.appspot.com',
  messagingSenderId: '16243974718',
  appId: '1:16243974718:web:d69ba35a2d588a91d9276f',
  measurementId: 'G-V06PHVMN3L',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
// expo+firebase docs: https://rnfirebase.io/#expo

export const storeUserDataInFirebase = (userId, email, authCode, authToken, refreshToken, authTokenExpirationDate, authTokenScope) => {

  const database = getDatabase();
  
  
  // Push the user data to the database
  set(ref(database, 'users/'+userId), {
    email: email,
    authCode: authCode,
    authToken: authToken,
    refreshToken: refreshToken,
    authTokenExpirationDate: authTokenExpirationDate,
    authTokenScope:authTokenScope
  })
  .then(() => {
    console.log('User data stored successfully in Firebase');
  })
  .catch((error) => {
    console.error('Error storing user data in Firebase:', error);
  });
};
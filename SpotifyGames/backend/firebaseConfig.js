import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// .env file configuration
// TODO add react-native-dotenv to plugins
// https://www.npmjs.com/package/react-native-dotenv


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDTIYbZHcrqFV0uK4sjksxd48zce9h1uM8",
  authDomain: 'spotify-games.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'spotify-games',
  storageBucket: 'spotify-games.appspot.com',
  messagingSenderId: '16243974718',
  appId: '1:16243974718:web:d69ba35a2d588a91d9276f',
  measurementId: 'G-V06PHVMN3L',
};

// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// const app = initializeApp(firebaseConfig);
// // Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app)

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
// expo+firebase docs: https://rnfirebase.io/#expo



export async function signIn (email, password){
  let response;
  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // response = {user:user, errorcode: null, errorMessage:null}
      console.log(user)
      alert("logged in!")

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // response = {user:null, errorcode: errorCode, errorMessage:errorMessage}
      console.log(errorCode, errorMessage)
      alert("error logging in")


    });
    return response;
}


export async function signUp (email, password){

  const auth = getAuth(app);

  // let response;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      // ...
      // response = {user:user, errorcode: null, errorMessage:null}
      console.log(user)
      alert("registered successfully!")

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      // response = {user:user, errorcode: null, errorMessage:null}
      console.log(errorCode, errorMessage)
      alert("error registering")

    });

    return response

}
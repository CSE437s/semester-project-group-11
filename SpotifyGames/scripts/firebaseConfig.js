import { initializeApp } from 'firebase/app';

import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";

import { save, getValueFor } from './SecureStore.js'


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

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Returns user credential if successful login, otherwise returns respective error code from Firebase
// output formatted as {user:user,  errorcode: errorCode, errorMessage:errorMessage}
export async function signInFirebase(email, password) {
  let response;
  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    const user = userCredential.user;
    response = { user: user, errorcode: undefined, errorMessage: undefined }
    console.log(user)
    // await save("user", JSON.stringify(user))
    alert("logged in!")
  }
  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    response = { user: undefined, errorcode: errorCode, errorMessage: errorMessage }
    console.log(errorCode, errorMessage)
    alert("error logging in")

  };
  return response;
}


export async function signUpFirebase(email, password) {
  let response
  try {
    const auth = getAuth(app);
    const userCredential = createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user;
    response = { user: user, errorcode: undefined, errorMessage: undefined }
    console.log(user)
    alert("registered successfully!")

  }

  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    response = { user: undefined, errorcode: errorCode, errorMessage: errorMessage }
    console.log(errorCode, errorMessage)
    alert("error registering")
  };

  return response
}

export async function signOutFirebase() {
  try {
    const auth = getAuth(app);
    const res = await signOut(auth);
    alert("signout successful!");
  }
  catch (error) {
    alert("signout unsuccessful");
  }
}

// export async function getAuthStatusFirebase(){
//   try{
//     const auth = getAuth(app);
//     return auth;
//   }
//   catch (error){
//     console.log("unable to get auth")
//   }
// }

export const getAuthStateChangeFirebase = (setIsLoggedIn) => {
  try {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }
  catch (error) {
    console.log("unable to create isLoggedIn event listener")
    return () => false;
  }
}
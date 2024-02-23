import { auth } from "./firebaseConfig.js";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Returns user credential if successful login, otherwise returns respective error code from Firebase
// output formatted as {user:user,  errorcode: errorCode, errorMessage:errorMessage}
export async function signInFirebase(email, password) {
    let response;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
  
      const user = userCredential.user;
      response = { user: user, errorcode: undefined, errorMessage: undefined }
      // console.log(user)
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
  
      const userCredential = createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      response = { user: user, errorcode: undefined, errorMessage: undefined }
      // console.log(user)
      alert("registered successfully!")
  
    }
  
    catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      response = { user: undefined, errorcode: errorCode, errorMessage: errorMessage }
      console.log(errorCode, errorMessage)
      alert("error registering")
    };
  
    return response;
  }
  
  export async function signOutFirebase() {
    try {
  
      const res = await signOut(auth);
      alert("signout successful!");
    }
    catch (error) {
      alert("signout unsuccessful");
    }
  }
  
  export const getAuthStateChangeFirebase = (setIsLoggedIn) => {
    try {
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
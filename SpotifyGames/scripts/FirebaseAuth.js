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
      alert("Logged in!")
    }
    catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      response = { user: undefined, errorcode: errorCode, errorMessage: errorMessage }
      console.log(errorCode, errorMessage)
      alert("We didn't find an account with this email and password.")
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
      alert("Registered successfully!")
  
    }
  
    catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      response = { user: undefined, errorcode: errorCode, errorMessage: errorMessage }
      console.log(errorCode, errorMessage)
      alert("An account with this email already exists")
    };
  
    return response;
  }
  
  export async function signOutFirebase() {
    try {
  
      const res = await signOut(auth);
      alert("Signout successful!");
    }
    catch (error) {
      alert("Signout unsuccessful");
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
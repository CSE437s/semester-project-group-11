/**
 * Create a form that allows existing users to sign in using their email address and password. 
 * When a user completes the form, call the signInWithEmailAndPassword method:
 */

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export function signIn (email, password){
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      return {user:user, errorcode: null, errorMessage:null}
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return {user:null, errorcode: errorCode, errorMessage:errorMessage}
    });
}

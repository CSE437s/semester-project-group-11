/**
 * Create a form that allows new users to register with your app using their email address and a password. 
 * When a user completes the form, validate the email address and password provided by the user, 
 * then pass them to the createUserWithEmailAndPassword method:
 */
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
import { auth } from "./firebaseConfig.js";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Returns user credential if successful login, otherwise returns respective error code from Firebase
// output formatted as {user:user,  error: errorCode, message:errorMessage}
export async function signInFirebase(email, password) {
  let response;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    const user = userCredential.user;
    response = { user: user, error: undefined, message: "Success" }
    // console.log(user)
    // await save("user", JSON.stringify(user))
    console.log("Logged in!")
  }
  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    response = { user: undefined, error: errorCode, message: "We didn't find an account with this email and password." }
    // console.log(errorCode, errorMessage)
    // console.log()
  };
  return response;
}

export async function signUpFirebase(email, password) {
  let response
  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user;

    response = { user: user, error: undefined, message: "Success" }
    // console.log(user)
    console.log("Registered successfully!")

  }

  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    response = { user: undefined, error: errorCode, message: "An account with this email already exists" }
    
  };

  return response;
}

export async function signOutFirebase() {
  try {

    const res = await signOut(auth);
    console.log("Signout successful!");
  }
  catch (error) {
    console.log("Signout unsuccessful");
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
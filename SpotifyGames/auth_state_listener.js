/**
 * For each of your app's pages that need information about the signed-in user, attach an observer to the global authentication object. 
 * This observer gets called whenever the user's sign-in state changes.
 * 
 * Attach the observer using the onAuthStateChanged method. 
 * When a user successfully signs in, you can get information about the user in the observer.
 */
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
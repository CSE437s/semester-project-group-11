import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, where, query, getDocs } from "firebase/firestore";
import { app } from "./FirebaseConfig.js"
import { User, userConverter } from "./UserModel.js";

const db = getFirestore(app);

export async function isUniqueUsername(username) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty
    }
    catch (error) {
        console.log(error);
    }
}

export async function addUser(username, email) {
    try {
        const ref = doc(db, "users", username).withConverter(userConverter);
        await setDoc(ref, new User(username, email))
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}

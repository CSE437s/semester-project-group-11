import { initializeApp } from "firebase/app";
import { app } from "./firebaseConfig.js"
import { User, userConverter } from "./UserModel.js";
import axios from 'axios';


export async function addUser(username, email) {
    const endpointURL = process.env.EXPO_PUBLIC_SERVER_URL + "/user/add";
    try {
        const res = await axios.post(endpointURL, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { email: email, username: username }
        });
        console.log("RES???????", res);
        return res;
    }
    catch (error) {
        console.log(error);
        return error;
    }
}
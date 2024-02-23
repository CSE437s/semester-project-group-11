import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, where, query, getDocs } from "firebase/firestore";
import { app } from "./firebaseConfig.js"
import { User, userConverter } from "./UserModel.js";
import axios from 'axios';

// import https from 'https';
// import fs from 'fs';

const db = getFirestore(app);

// const customCACert = fs.readFileSync(process.env.EXPO_PUBLIC_SERVER_SSL_CERT_PATH)

// const axiosWithCustomCert = axios.create({
//     httpsAgent: new https.Agent({ ca: customCACert }),
// });


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

// export async function isUniqueEmail(email){
//     console.log("isUniqueEmail called with email:",email)
//     const endpointURL = process.env.EXPO_PUBLIC_SERVER_URL + "/user/email/unique";
//     try {
//         const res = await axios.post(endpointURL, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             data: { email: email }
//         })
//         const unique = res.data.unique;
//         console.log("is unique????", unique);

//         return unique;
//     }
//     catch (error) {
//         console.log(error);
//     }
// }

// export async function isSanitizedUsername(username) {
//     console.log("isSanitizedUsername called")
//     const endpointURL = process.env.EXPO_PUBLIC_SERVER_URL + "/user/username/sanitized";
//     try {
//         const res = await axios.post(endpointURL, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             data: { username: username }
//         })
//         // console.log(res)
//         const sanitized = res.data.sanitized;
//         const approvedUsername = res.data.username;
//         console.log("is sanitized????", sanitized);
//         return {sanitized:sanitized, username:approvedUsername};
//     }
//     catch (error) {
//         console.log(error);
//     }
// }

// export async function isUniqueUsername(username) {

//     // axios.get(process.env.EXPO_PUBLIC_SERVER_URL + "/test",
//     //     {
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //         }
//     //     }
//     // ).then((res) => {
//     //     console.log("penis!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
//     //     console.log(res.data.message)

//     // }).catch((e) => {
//     //     console.log("error", e)
//     // })

//     console.log("isUniqueUsername called with username:",username)
//     const endpointURL = process.env.EXPO_PUBLIC_SERVER_URL + "/user/username/unique";
//     try {
//         const res = await axios.post(endpointURL, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             data: { username: username }
//         })
//         console.log(res.data.message);
//         const unique = res.data.unique;
//         console.log("is unique????", unique);

//         return unique
//     }
//     catch (error) {
//         console.log(error);
//     }


//     // try {
//     //     const response = await fetch(endpointURL, {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //         },
//     //         body: JSON.stringify({ username: username }),
//     //     });

//     //     if (!response.ok) {
//     //         throw new Error(`Network response was not ok: ${response.statusText}`);
//     //     }

//     //     const data = await response.json();
//     //     return data.isUniqueUsername;

//     // } catch (error) {
//     //     console.error('Error:', error.message);
//     // }

// }
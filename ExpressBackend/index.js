const express = require('express');
// const {initializeApp} = require('firebase-admin/app');
const admin = require('firebase-admin');
const asyncHandler = require('express-async-handler');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const firebaseApp = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://group11-8368c-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


async function addUser(uid, username, email) {
  try {
    const res = await db.collection('users').doc(uid).set({
      email: email,
      username: username,
      friends: [],
      spotifyInfo: ""
    })

    console.log('Added document with ID: ', res.id);

    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}


async function isUniqueEmail(email) {
  try {
    const usersRef = db.collection('users');
    // const allUsers = await usersRef.orderBy("username").get();
    // allUsers.forEach((doc) => {
    //   console.log(doc.id, '=>', doc.data());
    // });
    const snapshot = await usersRef.where('email', '==', email).get();
    return snapshot.empty
  }
  catch (error) {
    throw Error("error querying emails")
  }
}

async function isUniqueUsername(username) {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    return snapshot.empty
  }
  catch (error) {
    throw Error("error querying usernames")
  }
}

function isUsernameSanitized(username) {

  return /^[0-9a-z_.-]+$/.test(username);
}

app.post("/user/delete", asyncHandler(async (req, res) => {
  const id = req.body.data.id;

  try {
    const res = await db.collection('users').doc(id).delete();
    res.status(200).json({message:"deleted user"});
  }
  catch(error) {
    console.log(error);
    return res.status(200).json({message:"failed to delete user"});
  }
}));

app.post("/user/username/validate", asyncHandler(async (req, res) => {
  const username = req.body.data.username;

  try{
    const isUnique = isUniqueUsername(username);
    if (isUnique){
      return res.status(200).json({message:"username is unique"});
    }
    else {
      return res.status(400).json({message:"username is not unique"});
    }
  }
  catch(error){
    console.log(error);
    return res.status(400).json({message:"username is not unique, error"});
  }
}));

app.post("/user/add", asyncHandler(async (req, res) => {

  console.log("HELLOOO WHAT THE FUCK", req.body.data.email)

  const username = String(req.body.data.username).toLowerCase();
  const email = req.body.data.email;
  const uid = req.body.data.uid;

  try {

    const sanitizedUsername = isUsernameSanitized(username);

    if (!sanitizedUsername) {
      return res.status(400).json({ message: "Username not sanitized" });
    }
    console.log("username sanitized...");
    const uniqueEmail = await isUniqueEmail(email);

    if (!uniqueEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    console.log("email is unique...");


    const uniqueUsername = await isUniqueUsername(username);
    if (!uniqueUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    console.log("username is unique...");

    const addedUser = await addUser(uid, username, email);

    if (!addedUser) {
      return res.status(500).json({ message: "Unable to add user to database" })
    }

    console.log("user is added!");


    return res.status(200).json({ message: "Success" });
  }
  catch (error) {
    // console.log(error)
    return res.status(500).json({ message: "Error registering user", error: error });
  }
}));

app.get('/test', (req, res) => {
  console.log("got it")
  res.status(200).json({ message: 'This is a test endpoint.' });
});

const PORT = 16969 || process.env.PORT;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
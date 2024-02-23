const express = require('express');
// const {initializeApp} = require('firebase-admin/app');
const admin = require('firebase-admin');
const asyncHandler = require('express-async-handler');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv')

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


// GET IP THROUGH TERMINAL COMMAND FIRST, STORE IN ENV?

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

async function addUser(username, email) {
  try {
      const ref = doc(db, "users", username).withConverter(userConverter);
      await setDoc(ref, new User(username, email))
      return true;
  } catch (e) {
      console.error("Error adding document: ", e);
      return false;
  }
}

async function isUniqueEmail(email) {
  try {
    const usersRef = db.collection('users');
    const allUsers = await usersRef.orderBy("username").get();
    allUsers.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
    const snapshot = await usersRef.where('email', '==', email).get();
    return snapshot.empty
  }
  catch (error) {
      throw Error("error querying usernames")
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

app.post("/user/add", asyncHandler(async (req, res) => {

  const username = String(req.body.data.username).toLowerCase();
  const email = req.body.data.email;
  
  try{

    const sanitizedUsername = isUsernameSanitized(username);

    if (!sanitizedUsername){
      return res.status(400).json({message: "Username not sanitized"});
    }
    console.log("username sanitized...");
    const uniqueEmail = await isUniqueEmail(email);

    if (!uniqueEmail){
      return res.status(400).json({message: "Email is already in use"});
    }

    console.log("email is unique...");


    const uniqueUsername = await isUniqueUsername(username);
    if (!uniqueUsername){
      return res.status(400).json({message: "Username already exists"});
    }

    console.log("username is unique...");

    const addedUser = await addUser(username, email);

    if (!addedUser){
      return res.status(500).json({message:"unable to add user to database"})
    }

    console.log("user is added!");


    return res.status(200).json({message: "Success"});
  }
  catch (error) {
    // console.log(error)
    return res.status(500).json({message: "Error registering user", error:error});
  }
}));

// app.post("/user/username/sanitized", asyncHandler(async (req, res) => {
//   if (!req.body.data.username){
//     console.log("no username");
//     return res.status(400).json({sanitized:false, username: null, message:"Username not given"});
//   }
//   const username = new String(req.body.data.username);
//   const usernameLower = username.toLowerCase();
//   console.log("username??", usernameLower);
//   if (isUsernameSanitized(usernameLower)){
//     return res.status(200).json({sanitized:true, username:usernameLower, message:"Username is sanitized"});
//   }
//   else{
//     return res.status(400).json({sanitized:false, username: null, message:"Username not sanitized"});
//   }

// }))

// app.post("/user/username/unique", asyncHandler(async (req, res) => {

//   const username = req.body.data.username;
  
//   try{
//     const isUnique = await isUniqueUsername(username);
//     if (isUnique){
//       return res.status(200).json({message: "Success", unique:true});
//     }
//     else{
//       return res.status(400).json({message: "Username already exists", unique:false});
//     }
//   }
//   catch (error) {
//     console.log(error)
//     return res.status(500).json({message: "Error querying username in database"});
//   }
// }));

// app.post("/user/email/unique", asyncHandler(async (req, res) => {

//   const email = req.body.data.email;
  
//   try{
//     const isUnique = await isUniqueEmail(email);
//     if (isUnique){
//       return res.status(200).json({message: "Success", unique:true});
//     }
//     else{
//       return res.status(400).json({message: "Email already exists", unique:false});
//     }
//   }
//   catch (error) {
//     console.log(error)
//     return res.status(500).json({message: "Error querying username in database"});
//   }
// }));

app.get('/test', (req, res) => {
  console.log("got it")
  res.status(200).json({ message: 'This is a test endpoint.' });
});

const PORT = 16969 || process.env.PORT;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
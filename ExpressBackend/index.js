const express = require('express');
const {initializeApp} = require('firebase-admin/app');
const admin = require('firebase-admin');
const {getFirestore} = require('firebase/firestore');
const asyncHandler = require('express-async-handler');
const cors = require('cors');
const ngrok = require('ngrok');

const app = express();
app.use(express.json());
app.use(cors());

initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://group11-8368c-default-rtdb.firebaseio.com"
});

const db = admin.database();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function isUniqueUsername(username) {
  try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty
  }
  catch (error) {
      
      throw Error("error querying usernames")
  }
}

function isUsernameSanitized(username) {
  return /^[0-9a-zA-Z_.-]+$/.test(username);
}

app.post("/user/validate", asyncHandler(async (req, res) => {

  console.log("got it")

  const username = req.body.data.username;

  if (!isUsernameSanitized(username)){
    return res.status(400).json({isUniqueUsername:false, message:"Username not sanitized"});
  }

  try{
    const isUnique = await isUniqueUsername(username);
    if (isUnique){
      return res.status(200).json({message: "Success", isUnique:true});
    }
    else{
      return res.status(400).json({message: "Username already exists", isUnique:false});
    }
  }
  catch (error) {
    return res.status(500).json({message: "Error querying username in database"});
  }
}));

const PORT = 16969;

// Use ngrok to create a tunnel to your local server
const startNgrok = async () => {
  try {
    const url = await ngrok.connect(PORT);
    console.log(`Ngrok tunnel is active at ${url}`);
  } catch (err) {
    console.error('Error starting ngrok:', err);
  }
};

// Start the Express server and ngrok tunnel
const startServer = async () => {
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Start ngrok after the server has started
  await startNgrok();
};

// Start the server
startServer();
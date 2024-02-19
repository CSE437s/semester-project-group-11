const express = require('express');
const {initializeApp} = require('firebase-admin/app');
const admin = require('firebase-admin');
const {getFirestore} = require('firebase/firestore');
const asyncHandler = require('express-async-handler');


const app = express();
app.use(express.json());

initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://group11-8368c-default-rtdb.firebaseio.com"
});

const db = admin.database();

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
  const username = req.body.username;

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

const db = admin.firestore();

app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Client-side check (optional)
  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  // Server-side check
  const isUsernameUnique = await checkUsernameUniqueness(username);

  if (isUsernameUnique) {
    // Proceed with user registration
    // ...

    return res.status(201).json({ message: 'User registered successfully' });
  } else {
    // Username is not unique
    return res.status(400).json({ error: 'Username is already taken' });
  }
});

async function checkUsernameUniqueness(username) {
  const snapshot = await db.collection('users').where('username', '==', username).get();
  return snapshot.empty;
}

function isValidUsername(username) {
  // Implement your client-side validation logic
  // ...
  return true;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

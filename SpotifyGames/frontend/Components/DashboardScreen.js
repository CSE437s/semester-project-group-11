import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../scripts/firebaseConfig';
import LogoutButton from './LogoutButton';
import SpotifyLoginButton from './SpotifyLoginButton';
import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';
import { getAuth } from 'firebase/auth';
import { ThemeProvider } from '@react-navigation/native';
import styles from './Styles';

const DashboardScreen = ({ navigation }) => {
  const firestore = getFirestore(app);
  const auth = getAuth();
  const currentUser = auth.currentUser;


  const generateGameCode = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleCreateLobby = async () => {
    try {
      const gameCode = generateGameCode();
      const username = 'YourUsername'; // Replace with actual username
      await setDoc(doc(firestore, 'gameLobbies', gameCode), {
        players: [username],
        createdAt: serverTimestamp(),
        // Other lobby data
      });
  
      navigation.navigate('WaitingLobby', { gameCode, username });
    } catch (error) {
      console.error("Error creating lobby: ", error);
      // Handle error in UI
    }
  };
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Gamify!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={{ color: "white" }}>My Profile</Text>
        </TouchableOpacity>

        {/* Add a Start Game button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Game")}
        >
          <Text style={{ color: "white" }}>Start Higher Lower Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
         onPress={() => navigation.navigate("RouletteScreen")}
         >
            <Text style={{ color: "white" }}>Play Roulette</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} 
          onPress={handleCreateLobby}>
            <Text style={{ color: "white" }}>Create Roulette Lobby</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() =>
            console.log("token? ", localStorage.getItem("spotifyInfo"))
          }
        >
          <Text style={{ color: "white" }}>Test token in localstorage</Text>
        </TouchableOpacity> */}

        <LogoutButton />
      </View>
    </ThemeProvider>
  );
};

export default DashboardScreen;

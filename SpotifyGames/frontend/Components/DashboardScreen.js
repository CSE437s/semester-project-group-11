import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDatabase, ref, set, push } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';
import LogoutButton from './LogoutButton';
import { getTopTracks } from '../../scripts/SpotifyApiRequests';
import { getAuth } from 'firebase/auth';
import { ThemeProvider } from '@react-navigation/native';
import styles from './Styles';
import { getUserFirebaseInfo, parseTokenFromInfo, saveUserTopSongs } from '../../scripts/SaveUserData';

const DashboardScreen = ({ navigation }) => {
  const firestore = getFirestore(app);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  React.useEffect(() => {
    storeUserTopSongs();
  },[])

  const generateGameCode = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const storeUserTopSongs = async () => {
     
      const spotifyInfo = localStorage.getItem("spotifyInfo");
      const spotifyToken = parseTokenFromInfo(spotifyInfo);

      if (!spotifyToken) {
        console.error("Spotify token is not available.");
        return;
      }

      console.log("SPOTIFY TOKEN",spotifyToken);

      const songs = await getTopTracks(spotifyToken);

      console.log(songs);
      
      const res = await saveUserTopSongs(songs);

      console.log("able to save top songs????", res);

  }

  const handleCreateLobby = async () => {

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {

      const db = getDatabase(app);
      const userData = getUserFirebaseInfo();

      try {
        // const gameCode = generateGameCode();
        //REPLACE LATER WITH GENERATED CODE
        const gameCode = "ABC123";

        const username = userData.username; 
        const topSongs = userData.topSongs;

        const usersRef = ref(db, "lobbies/"+gameCode+"/users");

        push(usersRef, {
          uid:user.uid,
          username: username,
          topSongs: topSongs
        });

        set(ref(db, "lobbies/"+gameCode+"/gameStatus"), {
          hasStarted: false,
          round:1,
          isOver: false,
          hostUID: user.uid,
          hostUsername: username
        });

        // await setDoc(doc(firestore, 'gameLobbies', gameCode), {
        //   players: [username],
        //   createdAt: serverTimestamp(),
        //   // Other lobby data
        // });

        navigation.navigate('WaitingLobby', { gameCode, username });
      } catch (error) {
        console.error("Error creating lobby: ", error);
        // Handle error in UI
      }
    }
    else{
      console.log("unable to get realtime DB because user is not logged in");
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


import React from 'react';
import { View, Text, TouchableOpacity, Pressable, TextInput } from 'react-native';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDatabase, ref, set, get } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';
import LogoutButton from './LogoutButton';
import { getTopTracks } from '../../scripts/SpotifyApiRequests';
import { getAuth } from 'firebase/auth';
import { ThemeProvider } from '@react-navigation/native';
import styles from './Styles';
import { getUserFirebaseInfo, parseTokenFromInfo, saveUserTopSongs } from '../../scripts/SaveUserData';
import { onLobbyJoin } from '../../scripts/Lobbies';



const DashboardScreen = ({ navigation }) => {
  const firestore = getFirestore(app);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [gameCode, setGameCode] = React.useState("");


  React.useEffect(() => {
    storeUserTopSongs();
  }, [])

  const handleGameCodeChange = (text) => {
    setGameCode(text.toUpperCase());
  };

  const generateGameCode = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
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

    console.log("SPOTIFY TOKEN", spotifyToken);

    const songs = await getTopTracks(spotifyToken);

    console.log(songs);

    const res = await saveUserTopSongs(songs);

    console.log("able to save top songs????", res);

  }

  const handleJoinLobby = async () => {

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("cannot create lobby, user not logged in");
    }
    const db = getDatabase(app);

    const userData = await getUserFirebaseInfo();
    const username = userData.username;

    get(ref(db, "lobbies/" + gameCode)).then((snapshot) => {
      if (snapshot.exists()) {
        onLobbyJoin(gameCode).then(() => navigation.navigate('WaitingLobby', { gameCode, username }));
      }
      else{
        alert(gameCode + " is not a valid game code");
      }
    });
  }

  const handleCreateLobby = async () => {

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("cannot create lobby, user not logged in");
    }
    const db = getDatabase(app);

    try {
      const gameCode = generateGameCode();

      const userData = await getUserFirebaseInfo();

      const username = userData.username;

      set(ref(db, "lobbies/" + gameCode + "/gameStatus"), {
        hasStarted: false,
        round: 1,
        isOver: false,
        hostUID: user.uid,
        hostUsername: username
      });

      // await setDoc(doc(firestore, 'gameLobbies', gameCode), {
      //   players: [username],
      //   createdAt: serverTimestamp(),
      //   // Other lobby data
      // });

      onLobbyJoin(gameCode).then(() => navigation.navigate('WaitingLobby', { gameCode, username }));
    } catch (error) {
      console.error("Error creating lobby: ", error);
      // Handle error in UI
    }


  };
  return (
    
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Gamify!</Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={{ color: "white" }}>My Profile</Text>
        </Pressable>


        {/* Add a Start Game button */}
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Game")}
        >

          <Text style={{ color: "white" }}>Start Higher Lower Game</Text>
        </Pressable>

        {/* <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("RouletteScreen")}
      >
        <Text style={{ color: "white" }}>Play Roulette</Text>
      </TouchableOpacity> */}

        <Pressable style={styles.button}
          onPress={handleCreateLobby}>
          <Text style={{ color: "white" }}>Create Roulette Lobby</Text>
        </Pressable>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Game Code"
            value={gameCode}
            onChangeText={handleGameCodeChange}
          />
        </View>

        <Pressable style={styles.button}
          onPress={handleJoinLobby}>
          <Text style={{ color: "white" }}>Join Roulette Lobby</Text>
        </Pressable>

         
        <LogoutButton />
      </View>
   
  );
};

export default DashboardScreen;

import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { getFirestore, doc, setDoc, serverTimestamp, runTransaction, getDoc } from 'firebase/firestore';
import { getDatabase, ref, set, get } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';
import LogoutButton from './LogoutButton';
import { getTopTracks, trackNumberLimit } from '../../scripts/SpotifyApiRequests';
import { getAuth } from 'firebase/auth';
import styles from './Styles';
import { getUserFirebaseInfo, parseTokenFromInfo, saveUserTopSongs, getFromCrossPlatformStorage } from '../../scripts/SaveUserData';
import { onLobbyJoin } from '../../scripts/Lobbies';


const DashboardScreen = ({ navigation }) => {
  const firestore = getFirestore(app);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [gameCode, setGameCode] = React.useState("");


  React.useEffect(() => {

    const storeUserTopSongs = async () => {

      const spotifyInfo = await getFromCrossPlatformStorage("spotifyInfo");
      console.log(typeof (spotifyInfo), spotifyInfo);
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

    const checkIfUserAlreadyHasSongs = async () => {

      const spotifyInfo = await getFromCrossPlatformStorage("spotifyInfo");
      console.log(typeof (spotifyInfo), spotifyInfo);
      const spotifyToken = parseTokenFromInfo(spotifyInfo);

      if (!spotifyToken) {
        console.error("Spotify token is not available.");
        return;
      }

      if (currentUser) {
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", currentUser.uid);

        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()){
          console.log("user does not exist, cannot access their doc from checkIfUserAlreadyHasSongs");
          return;
        }

        if ( !userDoc.data().topSongs || userDoc.data().topSongs.length < trackNumberLimit){
          console.log("getting more songs bc the user needs more");
          await storeUserTopSongs();
        }
        else{
          console.log("user has sufficient songs");
        }
      }
    }

    checkIfUserAlreadyHasSongs();

  }, [])

  const handleGameCodeChange = (text) => {
    setGameCode(text.toUpperCase());
  };

  const generateGameCode = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };


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
      else {
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
        questionNumber: 1,
        totalQuestions: 0,
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

        <Text style={{ color: "white" }}>Higher Lower Game</Text>
      </Pressable>

      {/* <Pressable style={styles.button}
        onPress={() => navigation.navigate("RouletteScreen")}
      >
        <Text style={{ color: "white" }}>Play Roulette</Text>
      </Pressable> */}

      <Pressable style={styles.button}
        onPress={handleCreateLobby}>
        <Text style={{ color: "white" }}>Create Song Roulette Lobby</Text>
      </Pressable>

      <Pressable
        style={[styles.button, !gameCode.trim() && { opacity: 0.5 }]}
        onPress={handleJoinLobby}
        disabled={!gameCode.trim()} // Disable button when gameCode is empty
      >
        <Text style={{ color: "white" }}>Join Song Roulette Lobby</Text>
      </Pressable>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Game Code"
          value={gameCode}
          onChangeText={handleGameCodeChange}
        />

      </View>


      <LogoutButton />
    </View>

  );
};

export default DashboardScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set, get, update } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';
import styles from './Styles'

const WaitingLobbyScreen = ({ route, navigation }) => {
  const { gameCode, username } = route.params;
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const db = getDatabase(app);  // Define db here for reuse

  useEffect(() => {
    const gameStatusRef = ref(db, `lobbies/${gameCode}/gameStatus`);

    const hostListener = onValue(ref(db, `lobbies/${gameCode}/gameStatus/hostUID`), (snapshot) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      setIsHost(currentUser && currentUser.uid === snapshot.val());
    });

    const playerListener = onValue(ref(db, `lobbies/${gameCode}/users`), (snapshot) => {
      if (snapshot.exists()) {
        const userObjects = snapshot.val();
        const usernames = Object.values(userObjects).map(userinfo => userinfo.username);
        setPlayers(usernames);
      }
    });

    const gameStartListener = onValue(gameStatusRef, async (snapshot) => {
      if (snapshot.exists() && snapshot.val().hasStarted) {
        
        navigation.navigate('QuestionScreen', { gameCode });
      }
    });

    return () => {
      hostListener();
      playerListener();
      gameStartListener();
    };
  }, [db, gameCode, navigation]);  // Include db in dependency array for clarity

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const generateQuestionOrderAndStartGame = async () => {
    const songPoolRef = ref(db, `lobbies/${gameCode}/songPool`);
    get(songPoolRef).then((snapshot) => {
      if (!snapshot.exists()) {
        console.log("no songs in song pool");
        return;
      }

      const songsGroupedByUser = snapshot.val();

      // console.log(songsGroupedByUser, Object.keys(songsGroupedByUser));

      let songList = [];

      Object.keys(songsGroupedByUser).forEach((key) => {
        Object.entries(songsGroupedByUser[key]).forEach((song) => {
          // console.log("song?", song[1]);
          songList.push(song[1]);
        });
      });

      shuffleArray(songList);

      console.log("SONG LIST?", songList);

      const questionsRef = ref(db, `lobbies/${gameCode}/questions`);

      set(questionsRef, songList).then(() => {
        console.log("set questions at", Date.now());

        const gameStatusUpdates = {};
        gameStatusUpdates[`lobbies/${gameCode}/gameStatus/hasStarted`] = true;
        gameStatusUpdates[`lobbies/${gameCode}/gameStatus/totalQuestions`] = songList.length;

        update(ref(db), gameStatusUpdates)
          .then(() => console.log("Game started successfully!"))
          .catch(error => console.error("Error starting the game: ", error));
      }).catch((e) => console.log("couldn't set questions in database:", e));

    }).catch((e) => console.log(e));
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Waiting Lobby</Text> */}      <Text style={styles.title}>Game Code: {gameCode}</Text>
      <Text style={stylesLobby.host}>Host: {isHost ? "You are the host" : "Waiting for host"}</Text>
      <Text style={stylesLobby.player}>Your Username: {username}</Text>
      <Text style={styles.title}>Players in Lobby:</Text>
      {players.map((player) => (
        <Text key={player} style={stylesLobby.player}>
          {player}
        </Text>
      ))}
      {isHost && (
        <Pressable
          style={styles.button}
          onPress={() => {
            generateQuestionOrderAndStartGame()
              .catch((e) => console.log("error with generating song order", e));
          }}>
          <Text style={{ color: "white" }}>Start Game</Text>
        </Pressable>
      )}
    </View>
  );
};

const stylesLobby = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  host: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  player: {
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default WaitingLobbyScreen;

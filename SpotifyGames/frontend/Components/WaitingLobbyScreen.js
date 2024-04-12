import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';

const WaitingLobbyScreen = ({ route, navigation }) => {
  let { gameCode, username } = route.params;
  const [players, setPlayers] = useState([]);

  // FIX LATER
  gameCode = "ABC123"

  const firestore = getFirestore(app); // Initialize Firestore instance
  const realtimeDB = getDatabase(app);

  useEffect(() => {

    // const lobbyRef = doc(firestore, 'gameLobbies', gameCode);
    // const unsubscribe = onSnapshot(lobbyRef, (docSnapshot) => {
    //   if (docSnapshot.exists()) {
    //     setPlayers(docSnapshot.data().players);
    //   }
    // });

    // return () => unsubscribe();

    const lobbyRef = ref(realtimeDB, "lobbies/" + gameCode);
    const startGameRef = lobbyRef.child("gameStatus");

    const unsubscribe = onValue(startGameRef, (snapshot) => {

      if (!snapshot.exists) {
        console.log("snapshot doesn't exist for game :(");
      }

      const gameStatus = snapshot.val();
      const user = getAuth();

      //update the players shown in the lobby
      get(child(lobbyRef, "users")).then((usersSnapshot) => {

        //players currently formatted like this:
        // {
        //   uid:user.uid,
        //   username: username,
        //   topSongs: topSongs
        // }
        // refer to how they are pushed into the list in DashboardScreen.js if that changes

        if (!usersSnapshot.exists()) {
          console.log("users snapshot doesn't exist :(");
          return;
        }
        const userObjects = usersSnapshot.val();

        const usernames = map(userObjects, (user) => user.username);

        setPlayers(usernames);

      });

      if (gameStatus.hasStarted) {

        // Randomly generate which songs from the database will be used in the game

        if (user && user.uid == gameStatus.hostUID) {
          // host can run the algorithm to determine which songs are chosen for the game

          //Songs are currently stored under the user information in the players path
          // I'm thinking of randomly sampling 2 or so songs from each player and then putting
          // that into an answers section of the database

        }

        console.log("game started");
        // REDIRECT TO GAME START HERE
      }
      else if (gameStatus.isOver) {
        //do something when the game ends. Redirect to results screen?
      }
    })
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.code}>Game Code: {gameCode}</Text>
      <Text style={styles.title}>Waiting Lobby</Text>
      <Text style={styles.player}>Your Username: {username}</Text>
      <Text style={styles.title}>Players in Lobby:</Text>
      {players.map(player => (
        <Text key={player} style={styles.player}>{player}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  player: {
    fontSize: 16,
  },
});

export default WaitingLobbyScreen;

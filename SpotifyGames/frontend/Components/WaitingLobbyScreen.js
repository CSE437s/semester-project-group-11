import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getDatabase, ref, onValue, get, child } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';

const WaitingLobbyScreen = ({ route, navigation }) => {
  const { gameCode, username } = route.params;
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState();

  const db = getDatabase(app);

  useEffect(() => {

    // const lobbyRef = doc(firestore, 'gameLobbies', gameCode);
    // const unsubscribe = onSnapshot(lobbyRef, (docSnapshot) => {
    //   if (docSnapshot.exists()) {
    //     setPlayers(docSnapshot.data().players);
    //   }
    // });

    // return () => unsubscribe();

    const lobbyRef = ref(db, "lobbies/" + gameCode);
    const startGameRef = child(lobbyRef, "gameStatus");

    // setTimeout(() => {

      get(child(lobbyRef, "gameStatus/hostUsername")).then((snapshot) => {
        if (snapshot.exists()) {
          const hostName = snapshot.val()
          setHost(hostName);
        }
      });

      //update the players shown in the lobby
      onValue(child(lobbyRef, "users"), (usersSnapshot) => {

        if (!usersSnapshot.exists()) {
          console.log("users snapshot doesn't exist :(");
          return;
        }
        const userObjects = usersSnapshot.val();

        console.log("players in game:", userObjects, typeof (userObjects));

        const usernames = Object.values(userObjects).map((userinfo) => userinfo.username);
        console.log(usernames);

        setPlayers(usernames);
      });

      const unsubscribe = onValue(startGameRef, (snapshot) => {

        if (!snapshot.exists) {
          console.log("snapshot doesn't exist for game :(");
        }

        const gameStatus = snapshot.val();

        const auth = getAuth();
        const user = auth.currentUser;
        
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

    // }, 250);
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.code}>Game Code: {gameCode}</Text>
      <Text style={styles.title}>Waiting Lobby</Text>
      <Text>Host: {host}</Text>
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

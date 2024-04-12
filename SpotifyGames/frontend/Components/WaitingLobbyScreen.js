import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';

const WaitingLobbyScreen = ({ route, navigation }) => {
  const { gameCode, username } = route.params;
  const [players, setPlayers] = useState([]);

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

    const startGameRef = ref(realtimeDB, "lobbies/"+gameCode+"/gameStatus");
    const unsubscribe = onValue(startGameRef, (snapshot) => {
      const gameStatus = snapshot.val();

      const user = getAuth();

      if (gameStatus.hasStarted){

        // Randomly generate which songs from the database will be used in the game

        if (user && user.uid == gameStatus.hostUID){
          // host can run the algorithm to determine which songs are chosen for the game

          

        }

        console.log("game started");
        // REDIRECT TO GAME START HERE
      }
      else if (gameStatus.isOver){

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

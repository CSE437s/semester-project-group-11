import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { app } from '../../scripts/firebaseConfig';

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

    const gameStartListener = onValue(gameStatusRef, (snapshot) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.code}>Game Code: {gameCode}</Text>
      <Text style={styles.title}>Waiting Lobby</Text>
      <Text>Host: {isHost ? "You are the host" : "Waiting for host"}</Text>
      <Text style={styles.player}>Your Username: {username}</Text>
      <Text style={styles.title}>Players in Lobby:</Text>
      {players.map(player => (
        <Text key={player} style={styles.player}>{player}</Text>
      ))}
      {isHost && (
        <Pressable 
          style={styles.button} 
          onPress={() => {
            const gameStatusRef = ref(db, `lobbies/${gameCode}/gameStatus`);
            set(gameStatusRef, { hasStarted: true })
              .then(() => console.log("Game started successfully!"))
              .catch(error => console.error("Error starting the game: ", error));
          }}>
          <Text style={{ color: "white" }}>Start Game</Text>
        </Pressable>
      )}
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
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default WaitingLobbyScreen;

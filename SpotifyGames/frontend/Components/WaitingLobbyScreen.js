import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '../../scripts/firebaseConfig';

const WaitingLobbyScreen = ({ route, navigation }) => {
  const { gameCode, username } = route.params;
  const [players, setPlayers] = useState([]);

  const firestore = getFirestore(app); // Initialize Firestore instance

  useEffect(() => {
    const lobbyRef = doc(firestore, 'gameLobbies', gameCode);
    const unsubscribe = onSnapshot(lobbyRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setPlayers(docSnapshot.data().players);
      }
    });

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

// ScoreScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ScoreScreen = ({ route, navigation }) => {
  const { score, timeElapsed } = route.params;

  const handlePlayAgain = () => {
    // Navigate to GameScreen and reset the game state
    navigation.navigate('Game', { reset: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Your Score: {score}</Text>
      <Text style={styles.time}>Time Elapsed: {timeElapsed} seconds</Text>
      {/* <Button title="Play Again" onPress={handlePlayAgain} /> */}
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
  },
  time: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ScoreScreen;

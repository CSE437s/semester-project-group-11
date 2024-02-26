// ScoreScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ScoreScreen = ({ route, navigation }) => {
  const { score, timeTaken } = route.params;

  const playAgain = () => {
    // This will reset the navigation stack and start a new game
    navigation.reset({
      index: 0,
      routes: [{ name: 'Game' }],
    });
  };

  const returnHome = () => {
    // This will navigate back to the DashboardScreen
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Your Score: {score} / 9</Text>
      <Text style={styles.time}>Time Taken: {timeTaken} seconds</Text>
      <Button title="Play Again" onPress={playAgain} />
      <Button title="Return Home" onPress={returnHome} />
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
    margin: 10,
  },
  time: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ScoreScreen;

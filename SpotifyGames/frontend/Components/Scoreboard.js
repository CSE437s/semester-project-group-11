// Scoreboard.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Scoreboard = ({ scores, onNextQuestion, isHost, questionNumber }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question {questionNumber}</Text>
      {scores.map((userScore, index) => (
        <Text key={index} style={styles.score}>
          {userScore.username}: {userScore.score}
        </Text>
      ))}
      {/* {isHost && (
        <Button title="Next Question" onPress={onNextQuestion} />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    marginVertical: 4,
  },
});

export default Scoreboard;

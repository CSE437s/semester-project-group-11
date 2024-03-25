import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ScoreScreen = ({ route, navigation }) => {
  const { score } = route.params; // Receive the score passed from GameScreen

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Score: {score}</Text>
      <Button title="Go Home" onPress={() => navigation.navigate('Dashboard')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ScoreScreen;


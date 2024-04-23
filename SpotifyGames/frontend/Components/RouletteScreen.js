// RouletteScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from './Styles'

const RouletteScreen = ({ navigation }) => {
  return (
    // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={[styles.container]}>
      <Text>Roulette Game</Text>
      {/* Add your game logic and UI here */}
    </View>
  );
};

export default RouletteScreen;

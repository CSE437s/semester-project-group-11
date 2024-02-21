import React from 'react';
import { View, Text, Button } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome to Gamify</Text>
      <Button title="To Login Page" onPress={() => navigation.navigate('Login')} />
      <Button title="To Register Page" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LandingScreen;

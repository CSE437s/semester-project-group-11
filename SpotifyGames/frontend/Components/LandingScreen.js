import React from 'react';
import { View, Text, Button } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome to Gamify</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LandingScreen;

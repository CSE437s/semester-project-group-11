import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import LogoutButton from './LogoutButton';
import SpotifyLoginButton from './SpotifyLoginButton';
import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';

const DashboardScreen = ({ navigation }) => {
  return (
    <View>

      <Text>Welcome to Gamify!</Text>
      <Button
        title="My Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      {/* Add a Start Game button */}
      <Button
        title="Start Game"
        onPress={() => navigation.navigate('Game')} // Replace 'Game' with your actual game screen name
      />
      {/* <LogoutButton/> */}

    </View>
  );
};

export default DashboardScreen;
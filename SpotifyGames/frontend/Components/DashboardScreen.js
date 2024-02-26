import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import LogoutButton from './LogoutButton';
import SpotifyLoginButton from './SpotifyLoginButton';
import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';

const DashboardScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome to Gamify</Text>
      
      <Button title="My Profile" onPress={() => navigation.navigate('Profile')} />

      <LogoutButton />
    </View>
  );
};

export default DashboardScreen;

import React from 'react';
import { View, Text, Button } from 'react-native';

import LogoutButton from './LogoutButton';

const DashboardScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome to Gamify</Text>
      <LogoutButton/>
      <Button title="My Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
};

export default DashboardScreen;

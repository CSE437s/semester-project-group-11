import React from 'react';
import { View, Text, Button } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Your Profile</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default ProfileScreen;

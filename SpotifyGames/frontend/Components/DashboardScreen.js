import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import LogoutButton from './LogoutButton';
import SpotifyLoginButton from './SpotifyLoginButton';
import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';
import { getSpotifyTokenInfo } from '../../scripts/SaveUserData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ navigation }) => {

  useEffect(() => {
    getSpotifyTokenInfo().then((data) => {
      // console.log("USEEFFECT DATA", data);

      const spotifyInfo = data.spotifyInfo;
      const spotifyTokenExpiration = data.spotifyExpirationTime;

      AsyncStorage.setItem("spotifyInfo", spotifyInfo).then()
      AsyncStorage.setItem("spotifyTokenExpiration", spotifyTokenExpiration).then();
      console.log("set async storage tokens");
    }).catch((e) => {
      console.log(e);
      console.log("unable to retrieve spotify info from firebase")
    });
  });

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
      <LogoutButton />

      <Button
        title="Test token in asyncstorage"
        onPress={() => AsyncStorage.getItem("spotifyInfo").then((data) => {
          console.log("token?", data);
        })
        }
      />

      <Button
        title="Test token in firestore"
        onPress={() => {
          getSpotifyTokenInfo().then((info) => {
            console.log("token? ", info)
          });
        }}
      />

    </View>
  );
};

export default DashboardScreen;
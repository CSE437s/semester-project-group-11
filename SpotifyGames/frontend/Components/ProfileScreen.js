import React from "react";
import { View, Text, Button } from "react-native";

import { useState, useEffect } from "react";
import SpotifyLoginButton from "./SpotifyLoginButton";
// import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';
import SpotifyProfileComponent from "./SpotifyProfileComponent";
import { Platform } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import styles from "./Styles";
import { TouchableOpacity } from "react-native-web";

// MAKE A SCREEN WHILE ITS LOADING THE SPOTIFY AUTH TOKEN FROM SECURESTORE

const ProfileScreen = ({ navigation }) => {
  const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [spotifyToken, setSpotifyToken] = useState(null);

  useEffect(() => {
    const retrieve = async () => {
      let spotifyInfo;
      if (Platform.OS === "web") {
        spotifyInfo = localStorage.getItem("spotifyInfo");
      } else {
        // CHANGE FOR USE ON MOBILE
        spotifyInfo = localStorage.getItem("spotifyInfo");
      }

      if (!spotifyInfo) {
        console.log("couldn't get token");
        console.log(spotifyInfo);
        setIsLoading(false);
      } else {
        console.log(spotifyInfo);
        setIsLoggedIntoSpotify(true);
        setIsLoading(false);
      }
    };

    retrieve();
  }, [isLoggedIntoSpotify]);
  //use token to verify if we're logged in or not

  if (isLoading) {
    return (
      <View>
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={styles.container}>
          {isLoggedIntoSpotify ? (
            <View>
              <Text style={styles.title}>Your Profile:</Text>

              <SpotifyProfileComponent />

              <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
          ) : (
            <>
              <View>
                <Text>Your Profile:</Text>
                <Text>You are not logged into Spotify</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={{ color: "white" }}>Go back</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* <FriendList/> */}
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default ProfileScreen;

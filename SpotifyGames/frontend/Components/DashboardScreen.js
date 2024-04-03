import { useState, useEffect } from "react";
import { View, Text, Button, Pressable } from "react-native";
import LogoutButton from "./LogoutButton";
import SpotifyLoginButton from "./SpotifyLoginButton";
import { getOrRefreshStoredToken } from "../../scripts/SpotifyApiRequests";
import { ThemeProvider } from "@react-navigation/native";
import styles from "./Styles";

const DashboardScreen = ({ navigation }) => {
  return (
    
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Gamify!</Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={{ color: "white" }}>My Profile</Text>
        </Pressable>


        {/* Add a Start Game button */}
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Game")}
        >
          <Text style={{ color: "white" }}>Start Game</Text>
        </Pressable>

        {/* <Pressable
          style={styles.button}
          onPress={() =>
            console.log("token? ", localStorage.getItem("spotifyInfo"))
          }
        >
          <Text style={{ color: "white" }}>Test token in localstorage</Text>
        </Pressable> */}


        <LogoutButton />
      </View>
   
  );
};

export default DashboardScreen;

import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import LogoutButton from "./LogoutButton";
import SpotifyLoginButton from "./SpotifyLoginButton";
import { getOrRefreshStoredToken } from "../../scripts/SpotifyApiRequests";
import { ThemeProvider } from "@react-navigation/native";
import styles from "./Styles";
import { TouchableOpacity } from "react-native-web";

const DashboardScreen = ({ navigation }) => {
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Gamify!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={{ color: "white" }}>My Profile</Text>
        </TouchableOpacity>


        {/* Add a Start Game button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Game")}
        >
          <Text style={{ color: "white" }}>Start Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            console.log("token? ", localStorage.getItem("spotifyInfo"))
          }
        >
          <Text style={{ color: "white" }}>Test token in localstorage</Text>
        </TouchableOpacity>


        <LogoutButton />
      </View>
    </ThemeProvider>
  );
};

export default DashboardScreen;

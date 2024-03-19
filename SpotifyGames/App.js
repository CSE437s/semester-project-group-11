import { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./frontend/Components/LoginScreen.js";
import RegisterScreen from "./frontend/Components/RegisterScreen.js";
import TestProfile from "./frontend/Components/TestProfile.js";
import LandingScreen from "./frontend/Components/LandingScreen.js";
import DashboardScreen from "./frontend/Components/DashboardScreen.js";
import ProfileScreen from "./frontend/Components/ProfileScreen.js";

import SpotifyLoginScreen from "./frontend/Components/SpotifyLoginScreen.js";

import GameScreen from "./frontend/Components/GameScreen.js";
import ScoreScreen from "./frontend/Components/ScoreScreen.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./scripts/firebaseConfig.js";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, createTheme } from "@rneui/themed";

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  customFonts: {
    fontFamily: "MaterialIcons",
    src: 'url("MaterialIcons.ttf") format("truetype")',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1DB954",
  },
  title: {
    fontSize: 50,
    marginBottom: 40,
    color: "#191414",
    fontWeight: "bold",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#3AB4BA",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "white",
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#191414",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  landingButton: {
    width: "80%",
    backgroundColor: "#191414",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});

const theme = createTheme({
  lightColors: {
    primary: "#e7e7e8",
  },
  darkColors: {
    primary: "#000",
  },
  mode: "light",
});

export default function App() {
  const [user, setUser] = useState(null);
  const [spotifyToken, setSpotifyToken] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={user ? "Login" : "Dashboard"}>
            {user ? (
              <>
                {spotifyToken ? (
                  <>
                    <Stack.Screen
                      name="Dashboard"
                      component={DashboardScreen}
                    />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="Game" component={GameScreen} />
                    <Stack.Screen name="Score" component={ScoreScreen} />
                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name="SpotifyLoginScreen"
                      component={SpotifyLoginScreen}
                      initialParams={{ setSpotifyToken: setSpotifyToken }}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {/* <Stack.Screen name="Landing" component={LandingScreen} /> */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>

              // screens that can be accessed when the user is logged in or logged out should be denoted as such
              // <Stack.Screen navigationKey={isLoggedIn ? 'user' : 'guest'} name="Help" component={HelpScreen} />
              //NOTE: this would be outside the isLoggedIn ? ternary operator
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

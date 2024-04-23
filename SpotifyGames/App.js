import { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./frontend/Components/LoginScreen.js";
import RegisterScreen from "./frontend/Components/RegisterScreen.js";
import DashboardScreen from "./frontend/Components/DashboardScreen.js";
import ProfileScreen from "./frontend/Components/ProfileScreen.js";
import RouletteScreen from "./frontend/Components/RouletteScreen.js";
import WaitingLobbyScreen from "./frontend/Components/WaitingLobbyScreen.js";
import QuestionScreen from "./frontend/Components/QuestionScreen.js";
import SpotifyLoginScreen from "./frontend/Components/SpotifyLoginScreen.js";

import GameScreen from "./frontend/Components/GameScreen.js";
import ScoreScreen from "./frontend/Components/ScoreScreen.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./scripts/firebaseConfig.js";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, createTheme } from "@rneui/themed";
import styles from "./Styles";
import { getOrRefreshTokenFromFirebase } from "./scripts/SaveUserData.js";
import { GameProvider, useGame } from './scripts/GameContext.js';
import {onLobbyJoin, fetchUsersForGame} from './scripts/Lobbies.js';

const Stack = createNativeStackNavigator();

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
  const [spotifyToken, setSpotifyToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user){
        getOrRefreshTokenFromFirebase().then((token) => {
          // console.log("APP.JS TOKEN,",token);
          if (token){
            setSpotifyToken(token);
          }
        });
      }
      else{
        setSpotifyToken(null);
      }
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
                    <Stack.Screen
                      name="Game"
                      component={GameScreen}
                      options={{ title: "Higher Lower Game" }}
                    />
                    <Stack.Screen
                      name="ScoreScreen"
                      component={ScoreScreen}
                      options={{ title: "Final Score" }}
                    />
                    <Stack.Screen
                      name="RouletteScreen"
                      component={RouletteScreen}
                      options={{ title: "Song Roulette" }}
                    />
                    
                    <Stack.Screen
                      name="WaitingLobby"
                      component={WaitingLobbyScreen}
                      options={{ title: "Waiting Lobby" }}
                    />
                    <Stack.Screen name="QuestionScreen" component={QuestionScreen} />

                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name="SpotifyLoginScreen"
                      component={SpotifyLoginScreen}
                      initialParams={{ setSpotifyToken: setSpotifyToken }}
                      options={{ title: "Spotify Login" }}
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

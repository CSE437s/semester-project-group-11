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

import styles from "./Styles";

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
                    <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Higher Lower Game' }}/>
                    <Stack.Screen name="ScoreScreen" component={ScoreScreen} />
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

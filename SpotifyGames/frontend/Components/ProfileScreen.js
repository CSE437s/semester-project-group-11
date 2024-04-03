import React from "react";
import { View, Text, Button, Pressable, FlatList } from "react-native";

import { useState, useEffect } from "react";
import SpotifyLoginButton from "./SpotifyLoginButton";
// import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';
import SpotifyProfileComponent from "./SpotifyProfileComponent";
import { Platform } from "react-native";
import { ThemeProvider, ThemeConsumer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDataFromFirestore } from "../../scripts/SaveUserData";


// MAKE A SCREEN WHILE ITS LOADING THE SPOTIFY AUTH TOKEN FROM SECURESTORE

const ProfileScreen = ({ navigation }) => {
    const [firebaseProfile, setFirebaseProfile] = useState(null);
    const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (!isLoading) {
            return;
        }

        const retrieveFirebase = async () => {
            const data = await getUserDataFromFirestore();
            console.log("Firebase Data in profile:", data);
            setFirebaseProfile(data);
        }

        const retrieveSpotify = async () => {
            let spotifyInfo;
            if (Platform.OS === "web") {
                spotifyInfo = localStorage.getItem("spotifyInfo");
            } else {
                // CHANGE FOR USE ON MOBILE
                spotifyInfo = await AsyncStorage.getItem("spotifyInfo");
            }

            if (!spotifyInfo) {
                console.log("couldn't get token");
                console.log(spotifyInfo);

            } else {
                console.log(spotifyInfo);

                setIsLoggedIntoSpotify(true);

            }
        };

        retrieveFirebase();
        retrieveSpotify();
        setIsLoading(false);
    }, []);
    //use token to verify if we're logged in or not

    if (isLoading) {
        return (
            <View>
                <Text>Loading Profile...</Text>
            </View>
        );
    }

    const renderGameScorePair = ({ item }) => {
        console.log("ITEM",item);
        
        return (
          <Text>
            {item.key}: {item.value}
          </Text>
        );
      };

    return (

        <>
            {/* <View style={{flex: 1}}> */}
            <View style={styles.container}>

                {isLoggedIntoSpotify ? (
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Your Profile:</Text>
                        
                        {firebaseProfile && <View>
                            <Text>Your High Scores</Text>
                            
                            <FlatList 
                                data={Object.entries(firebaseProfile.scores).map(([key, value]) => ({ key, value }))}
                                renderItem={renderGameScorePair}
                                keyExtractor={(item) => item.key}
                            />
                            
                        </View>
                        }

                        <SpotifyProfileComponent />

                        <Button title="Go Back" onPress={() => navigation.goBack()} />
                    </View>
                ) : (
                    <>
                        <View>
                            <Text>Your Profile:</Text>
                            <Text>You are not logged into Spotify</Text>
                            <Pressable
                                style={styles.button}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={{ color: "white" }}>Go back</Text>
                            </Pressable>
                        </View>
                    </>
                )}

            </View>

        </>

    );
};

export default ProfileScreen;

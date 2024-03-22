import React from 'react';
import { View, Text, Button } from 'react-native';

import { useState, useEffect } from 'react';
import SpotifyLoginButton from './SpotifyLoginButton';
// import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';
import SpotifyProfileComponent from './SpotifyProfileComponent';
import { Platform } from 'react-native';


// MAKE A SCREEN WHILE ITS LOADING THE SPOTIFY AUTH TOKEN FROM SECURESTORE


const ProfileScreen = ({ navigation }) => {
    const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const [spotifyToken, setSpotifyToken] = useState(null);

    useEffect(() => {
  
      const retrieve = async () => {

        let spotifyInfo;
        if (Platform.OS === "web"){
            spotifyInfo = localStorage.getItem("spotifyInfo");
        }
        else{
            // CHANGE FOR USE ON MOBILE
            spotifyInfo = localStorage.getItem("spotifyInfo");
        }
  
        if (!spotifyInfo){
          console.log("couldn't get token");
          console.log(spotifyInfo);
          setIsLoading(false);
          
        }
        else{
            console.log(spotifyInfo);
            setIsLoggedIntoSpotify(true);
            setIsLoading(false);
        }
        
      }
  
      retrieve();
  
    }, [isLoggedIntoSpotify]);
    //use token to verify if we're logged in or not

    if (isLoading){
        return ( 
        <View>
            <Text>Loading Profile...</Text>            
        </View>
        )
    }
    
    return (
        <>
            {isLoggedIntoSpotify ? (
                <>
                    <View>
                        <Text>Your Profile:</Text>
                        
                        <SpotifyProfileComponent/>

                        <Button title="Go Back" onPress={() => navigation.goBack()} />
                    </View>
                </>
            ) : (
                <>
                    <View>
                        <Text>Your Profile:</Text>
                        <Text>You are not logged in for Spotify :(</Text>
                        <Button title="Go Back" onPress={() => navigation.goBack()} />
                    </View>
                </>
            )
            }

            {/* <FriendList/> */}

        </>
    );
};

export default ProfileScreen;

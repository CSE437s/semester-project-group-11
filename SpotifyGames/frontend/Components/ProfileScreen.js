import React from 'react';
import { View, Text, Button } from 'react-native';

import { useState, useEffect } from 'react';
import SpotifyLoginButton from './SpotifyLoginButton';
import { getOrRefreshStoredToken } from '../../scripts/SpotifyApiRequests';
import SpotifyProfileComponent from './SpotifyProfileComponent';


// MAKE A SCREEN WHILE ITS LOADING THE SPOTIFY AUTH TOKEN FROM SECURESTORE


const ProfileScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [spotifyToken, setSpotifyToken] = useState(null);

    useEffect(() => {
  
      const retrieve = async () => {
  
        const token = await getOrRefreshStoredToken();
  
        if (!token){
          console.log("couldn't get token");
          setSpotifyToken(null);
          setIsLoading(false);
          return;
        }
  
        setSpotifyToken(token);
        setIsLoading(false);
        
      }
  
      retrieve();
  
    }, [spotifyToken]);
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
            {spotifyToken != null ? (
                <>
                    <View>
                        <Text>Your Profile:</Text>
                        
                        <SpotifyProfileComponent spotifyToken={spotifyToken}/>

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

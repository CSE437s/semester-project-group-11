import React from 'react';
import { View, Text, Button } from 'react-native';

import { useState, useEffect } from 'react';
import { getProfile } from '../../scripts/SpotifyApiRequests';
import { getValueFor } from '../../scripts/SecureStore';
import SpotifyLoginButton from './SpotifyLoginButton';
import SpotifyProfileComponent from './SpotifyProfileComponent';

const ProfileScreen = ({ navigation }) => {

    // const [spotifyProfile, setSpotifyProfile] = useState(null);
    //use token to verify if we're logged in or not
    const [spotifyToken, setSpotifyToken] = useState(null);

    useEffect(() => {

        const retrieve = async () => {

            try {
                const SpotifyData = await getValueFor("SpotifyData")
                if (!SpotifyData) {
                    throw new Error("Spotify Response does not exist in Secure Store")
                }
                console.log("SpotifyRes", SpotifyData);
                const data = JSON.parse(SpotifyData);
                if (data.access_token) {
                    setSpotifyToken(data.access_token)
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        retrieve();

    }, [spotifyToken]);

    return (
        <>
            {spotifyToken ? (
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
                        <SpotifyLoginButton setSpotifyToken={setSpotifyToken}/>
                        <Button title="Go Back" onPress={() => navigation.goBack()} />
                    </View>
                </>
            )
            }
        </>
    );
};

export default ProfileScreen;

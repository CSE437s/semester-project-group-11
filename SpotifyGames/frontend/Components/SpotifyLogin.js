import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, AccessTokenRequest } from 'expo-auth-session';
import { Button, View, StyleSheet } from 'react-native';
import {save, getValueFor} from '../../scripts/SecureStore.js'
import { storeUserDataInFirebase } from '../../scripts/firebaseConfig';

import { getProfile, getFirstTokenData, getRefreshTokenData } from '../../scripts/SpotifyApiRequests';

// Expo has their own version of environment variables
// https://docs.expo.dev/guides/environment-variables/
// no need for external package
// import {SPOTIFY_CLIENT_SECRET, SPOTIFY_CLIENT_ID} from "@env";

WebBrowser.maybeCompleteAuthSession();


const expoRedirectUri = "exp://localhost:19006/--/spotify-auth-callback"

// console.log("test")

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};


function calculateExpirationTime(expiresIn){
    const currTime = Date.now()
    const expirationTime = currTime + expiresIn * 1000
    return expirationTime
}

export default function SpotifyLogin() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
            scopes: ['user-read-private', 'user-read-email', 'playlist-modify-public'],
            // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            clientSecret: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET,
            usePKCE: false,
            redirectUri: expoRedirectUri,
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            //   save("code", code)  
            //   console.log("code", code)
        }
    }, [response]);


    return (
        <View style={styles.container}>


            {/* <Image
                contentFit="cover"
                source="'./assets/spotify-logo.svg'"
            /> */}


            <Button
                disabled={!request}
                title="Connect your Spotify"
                onPress={() => {
                    // console.log("hello")
                    promptAsync().then((res) => {
                        // console.log("res!!!!!!!!!!!!!!!!", res)
                        // console.log(response.params)

                        token = getFirstTokenData(res.params.code, expoRedirectUri).then(
                            (tokenres) => {
                                if (tokenres.access_token){
                                    // TODO
                                    // Store in Firebase somehow, or ok to keep in local storage?
                                    // Secure store seems to persist for app installs for iOS, but unsure for Android
                                    save("authToken", tokenres.access_token)
                                    console.log("access token in local storage")
                                }
                                else{
                                    console.error("error getting access token", tokenres)
                                }
                            }
                        ).catch(
                            (err) => console.log("token err", err)
                        )
                    }).catch((e) => console.log("promptAsync err", err));

                }}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
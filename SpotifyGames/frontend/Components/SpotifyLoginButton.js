import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button, View, StyleSheet } from 'react-native';
import { saveSpotifyTokenInfo } from '../../scripts/SaveUserData.js'
import { calculateExpirationTime } from '../../scripts/SpotifyApiRequests.js';
import { getProfile, getFirstTokenData, getRefreshTokenData } from '../../scripts/SpotifyApiRequests.js';


WebBrowser.maybeCompleteAuthSession();

// const expoRedirectUri = makeRedirectUri({ native: 'your.app://', path: "callback", preferLocalhost: true });
// const expoRedirectUri = makeRedirectUri({ native: 'your.app://', preferLocalhost: true });

const expoRedirectUri = makeRedirectUri({scheme: 'your.app'}); //maybe the version to use for netlify?????

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};


// Handles request to spotify accessing user account
// if successful, adds the following to SecureStore
// ([key], [value])
// ("SpotifyAccessTokenResponse", Spotify's Response Object)
// ("SpotifyExpiration", Time when token expires and needs to be refreshed)

// if unsuccessful, alerts with an error
export default function SpotifyLoginButton({ setSpotifyToken }) {
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
        <>
            {
                (<>
                    <Button
                        title="TEST"
                        onPress={console.log("Hello")}
                    />
                    <Button
                        disabled={!request}
                        title="Connect your Spotify"
                        onPress={async () => {

                            console.log("URLLLLLLLL", expoRedirectUri);
                            console.log("calling login");

                            try {
                                const res = await promptAsync();

                                const tokenres = await getFirstTokenData(res.params.code, expoRedirectUri);

                                if (tokenres.access_token) {

                                    const expirationTime = calculateExpirationTime(Number(tokenres.expires_in));

                                    await saveSpotifyTokenInfo(JSON.stringify(tokenres), String(expirationTime));
                                    console.log("Access token saved in local storage");
                                    setSpotifyToken(true);

                                } else {
                                    console.error("Error getting access token", tokenres);
                                }
                            } catch (error) {
                                console.error("An error occurred:", error.message);
                                console.log("Unable to store token in secure store");
                            }
                        }
                        }
                    />
                </>)

                // :

                // (<>
                //     {setSpotifyToken(true)};
                // </>)

            }
        </>
    );

}
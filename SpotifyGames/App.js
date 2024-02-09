import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button, View, StyleSheet } from 'react-native';

// Expo has their own version of environment variables
// https://docs.expo.dev/guides/environment-variables/
// no need for external package
// import {SPOTIFY_CLIENT_SECRET, SPOTIFY_CLIENT_ID} from "@env";

WebBrowser.maybeCompleteAuthSession();

// console.log("test")

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      scopes: ['user-read-email', 'playlist-modify-public'],
      // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      clientSecret: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET,
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: 'iosauth-spotifygames://redirect'
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log(code)
    }
    // else{
    //   console.log(response)
    // }

  }, [response]);

  // console.log(request)

  return (
    <View style={styles.container}>
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
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
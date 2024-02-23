import { View, Text, Button } from 'react-native';
import SpotifyLoginButton from './SpotifyLoginButton';

const SpotifyLoginScreen = ({ navigation }) => {
    const {setSpotifyToken} = navigation.params;
  return (
    <View>
      <Text>Login to Spotify!</Text>

        <SpotifyLoginButton setSpotifyToken={setSpotifyToken}/>
      
    </View>
  );
};

export default SpotifyLoginScreen;

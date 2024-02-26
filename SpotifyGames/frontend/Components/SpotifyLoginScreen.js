import { View, Text, Button } from 'react-native';
import SpotifyLoginButton from './SpotifyLoginButton';

const SpotifyLoginScreen = ({ navigation, route }) => {
    const {setSpotifyToken} = route.params;

    const setSpotifyTokenWrapper = (t) => {
        console.log("called set with: ", t);
        setSpotifyToken(t);
    };

  return (
    <View>
      <Text> Login to Spotify! </Text>

        <SpotifyLoginButton setSpotifyToken={setSpotifyTokenWrapper} />
      
    </View>
  );
};

export default SpotifyLoginScreen;

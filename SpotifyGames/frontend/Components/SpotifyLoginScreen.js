import { View, Text, Button } from "react-native";
import SpotifyLoginButton from "./SpotifyLoginButton";
import styles from "./Styles";
import { ThemeProvider } from "react-native-paper";

const SpotifyLoginScreen = ({ navigation, route }) => {
  const { setSpotifyToken } = route.params;

  const setSpotifyTokenWrapper = (t) => {
    console.log("called set with: ", t);
    setSpotifyToken(t);
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Login to Spotify!</Text>

        <SpotifyLoginButton setSpotifyToken={setSpotifyTokenWrapper} />
      </View>
    </ThemeProvider>
  );
};

export default SpotifyLoginScreen;

import { useState, useEffect } from "react";
import { View, Text, Button, Image, FlatList } from "react-native";
import { getProfile } from "../../scripts/SpotifyApiRequests";
import { parseTokenFromInfo } from "../../scripts/SaveUserData";
import { ThemeProvider, ThemeConsumer, ListItem } from "@rneui/themed";
import { getTopArtists } from "../../scripts/SpotifyApiRequests";

const SpotifyProfileComponent = () => {
  const [firebaseProfile, setFirebaseProfile] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  // const [spotifyProfilePictureURL, setSpotifyProfilePictureURL] = useState(null);

  useEffect(() => {

    if (!isLoading) return;

    const getProfileData = async () => {
      // NEED MOBILE VERSION HERE AS WELL
      let spotifyInfo = localStorage.getItem("spotifyInfo");
      const spotifyToken = parseTokenFromInfo(spotifyInfo);
      console.log("spotifyTOKEN", spotifyToken);

      try {

        if (spotifyToken !== null) {
          const data = await getProfile(spotifyToken);
          console.log("DATA", data);
          setSpotifyProfile(data);
          // localStorage.setItem("spotifyProfile", data);

          const artists = await getTopArtists(spotifyToken);

          if (artists) {
            for (const artist in artists) {
              console.log("ARTIST", typeof (artist));
            }
            setTopArtists(artists);
          }
        }
      } catch (error) {
        console.log("getProfileDataError", error);
      }
      setIsLoading(false);
    };

    getProfileData();
  }, [isLoading]);

  if (isLoading) {
    return (
      <View>
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  function renderArtistItem({ artist, index }) {

    return (<>
      {/* <Text>{index + 1}. {artist.name} - Popularity: {artist.popularity}</Text>
      <Text>Genres: {artist.genres}</Text> */}
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{index + 1}. {artist.name}</ListItem.Title>
          <ListItem.Subtitle>{artist.genres}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </>);
  }


  return (
    <>
        {
          spotifyProfile ? (
            <>
              {/* <Image source={{ uri: spotifyProfilePictureURL != null ? spotifyProfilePictureURL : "icon.png" }} /> */}
              <Text>User ID: {spotifyProfile.id}</Text>
              <Text>Email: {spotifyProfile.email}</Text>
              <Text>Spotify URI: {spotifyProfile.uri}</Text>
              {/* <Text> {spotifyProfilePictureURL == null ?  spotifyProfilePictureURL : '(no profile image)'} </Text> */}
              {topArtists ? (
                <>
                  <View>
                    <Text>Your Top Artists:</Text>
                    <FlatList
                      data={topArtists}
                      renderItem={renderArtistItem}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </>
              )
                : (
                  <>
                    <Text>Unable to Retrieve Top Artists</Text>
                  </>
                )
              }
            </>
          ) : (
            <>
              <Text>Log in to see your Spotify Profile</Text>
              {/* maybe replace with a spotify logo or something similar */}
            </>
          )
        }
      
    
    </>
  );
};

export default SpotifyProfileComponent;

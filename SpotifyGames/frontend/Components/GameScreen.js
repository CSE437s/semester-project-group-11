import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import {
  getTopArtists,
  getTopSongsForArtistID,
} from "../../scripts/SpotifyApiRequests";
import { getFromCrossPlatformStorage, parseTokenFromInfo } from "../../scripts/SaveUserData";
import styles from "./Styles";
import { ThemeProvider, ThemeConsumer } from "@react-navigation/native";

const GameScreen = ({ navigation }) => {
  const [songs, setSongs] = useState([]);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userChoice, setUserChoice] = useState(null);
  const [correctChoice, setCorrectChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('white');
  

  useEffect(() => {
    async function fetchArtistsAndTracks() {
      setIsLoading(true);
      const spotifyInfo = await getFromCrossPlatformStorage("spotifyInfo");
      const spotifyToken = parseTokenFromInfo(spotifyInfo);

      if (!spotifyToken) {
        console.error("Spotify token is not available.");
        setIsLoading(false);
        return;
      }

      try {
        const artists = await getTopArtists(spotifyToken);
        const tracksPromises = artists.map((artist) =>
          getTopSongsForArtistID(spotifyToken, artist.id)
        );
        const tracks = await Promise.all(tracksPromises);

        const combinedTracks = tracks.flat(); // Flatten the tracks array
        setSongs(combinedTracks);
        setCurrentSongs(pickRandomSongs(combinedTracks, 2)); // Pick 2 random songs
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtistsAndTracks();
  }, []);

  const pickRandomSongs = (songs, number) => {
    let randomSongs = [];
    let usedIndices = new Set();

    while (randomSongs.length < number && randomSongs.length < songs.length) {
      let randomIndex = Math.floor(Math.random() * songs.length);
      if (!usedIndices.has(randomIndex)) {
        randomSongs.push(songs[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    return randomSongs;
  };

  const handleSongSelection = (selectedSongIndex) => {
    const selectedSong = currentSongs[selectedSongIndex];
    const isCorrect = selectedSong.popularity >= currentSongs[1 - selectedSongIndex].popularity;
  
    setUserChoice(selectedSong);
    setCorrectChoice(isCorrect ? selectedSong : currentSongs[1 - selectedSongIndex]);
    setResult(isCorrect ? "Correct" : "Incorrect");
  
    if (isCorrect) {
      setBackgroundColor('green');
      setScore((prevScore) => prevScore + 1);
    } else {
      setBackgroundColor('red');
      setLives((prevLives) => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          setTimeout(() => navigation.navigate("ScoreScreen", { score }), 3000);
        }

        return newLives;
      });
    }
  
    setShowResult(true);
  
    setTimeout(() => {
      setBackgroundColor('white'); // Reset background color
  
      // Update the songs immediately after resetting the background color
      const newRandomSong = pickRandomSongs(songs, 1)[0];
      setCurrentSongs([currentSongs[1], newRandomSong]); // Keep the second song and add a new random song
  
      setShowResult(false);
    }, 2000);
  };
  

  return (
      // <View style={[styles.container, { backgroundColor: backgroundColor }]}> 
      <View style={[styles.container]}> 
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text style={styles.title}>Choose the More Popular Song</Text>
            <Text style={{ position: "absolute", top: 10, left: 20 }}>
              Lives: {lives}
            </Text>
            <Text style={{ position: "absolute", top: 10, right: 20 }}>
              Score: {score}
            </Text>
            {currentSongs.map((song, index) => (
              <>
                <Pressable
                  key={song.id}
                  onPress={() => handleSongSelection(index)}
                  style={styles.songButton}
                >
                  <Image
                    source={{ uri: song.albumCover }}
                    style={stylesGameScreen.albumCover}
                  />

                  <Text style={styles.songText}>
                    {song.name} - {song.artist}
                  </Text>
                  {showResult && userChoice && song.id === userChoice.id && (
                    <Text style={styles.resultText}>
                      {result} - Popularity: {song.popularity}
                    </Text>
                  )}

                </Pressable>
              </>
            ))}
          </>
        )}
        <Pressable
          style={stylesGameScreen.quitButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={stylesGameScreen.quitButtonText}>Quit</Text>
        </Pressable>
      </View>
  );
};

// Styles
const stylesGameScreen = StyleSheet.create({
  // Add your styles here
  title: {
    fontSize: 30, // Set the font size to 30pt
    color: '#1DB954', // Spotify green color
    textShadowColor: 'black', // Black text shadow to create the border effect
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10 // Adjust the radius to control the border thickness
  },
  albumCover: {
    width: 250,
    height: 250,
    borderWidth: 10,
    borderColor: "black",
  },
  quitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f44336", // or any color you prefer
    borderRadius: 5,
    alignItems: "center",
  },
  quitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  quitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f44336", // or any color you prefer
    borderRadius: 5,
    alignItems: "center",
  },
});

export default GameScreen;

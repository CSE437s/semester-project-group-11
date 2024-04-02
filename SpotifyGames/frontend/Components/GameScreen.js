import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  getTopArtists,
  getTopSongsForArtistID,
} from "../../scripts/SpotifyApiRequests";
import { parseTokenFromInfo } from "../../scripts/SaveUserData";
import styles from "./Styles";
import { ThemeProvider } from "@react-navigation/native";

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

  useEffect(() => {
    async function fetchArtistsAndTracks() {
      setIsLoading(true);
      const spotifyInfo = localStorage.getItem("spotifyInfo");
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
    const otherSong = currentSongs[selectedSongIndex === 0 ? 1 : 0];

    const isCorrect = selectedSong.popularity >= otherSong.popularity;
    setUserChoice(selectedSong);
    setCorrectChoice(isCorrect ? selectedSong : otherSong);
    setResult(isCorrect ? "Correct" : "Incorrect");

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    } else {
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
      setLives((prevLives) => {
        if (prevLives > 0) {
          setCurrentSongs((prevCurrentSongs) => {
            const newRandomSong = pickRandomSongs(songs, 1)[0];
            return [prevCurrentSongs[1 - selectedSongIndex], newRandomSong];
          });
          setShowResult(false);
        }
        return prevLives;
      });
    }, 3000);
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
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
              <TouchableOpacity
                key={song.id}
                onPress={() => handleSongSelection(index)}
              >
                <Image
                  source={{ uri: song.albumCover }}
                  style={styles.topImageContainer}
                />
                <Text>
                  {song.name} - {song.artist}
                </Text>
                {showResult && userChoice && song.id === userChoice.id && (
                  <Text>
                    {result} - Popularity: {song.popularity}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}
        <TouchableOpacity
          style={stylesGameScreen.quitButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={stylesGameScreen.quitButtonText}>Quit</Text>
        </TouchableOpacity>
      </View>
    </ThemeProvider>
  );
};

// Styles
const stylesGameScreen = StyleSheet.create({
  // Add your styles here
  albumCover: {
    width: 100,
    height: 100,
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
  quitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // ...
});

export default GameScreen;

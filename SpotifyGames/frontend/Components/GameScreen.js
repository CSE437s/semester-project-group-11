import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getTopArtists, getTopSongsForArtistID } from '../../scripts/SpotifyApiRequests';
import { parseTokenFromInfo } from '../../scripts/SaveUserData';
import styles from "./Styles"

const GameScreen = ({ navigation }) => {
  const [songs, setSongs] = useState([]);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [lives, setLives] = useState(3);
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
        console.error('Spotify token is not available.');
        setIsLoading(false);
        return;
      }

      try {
        const artists = await getTopArtists(spotifyToken);
        const tracksPromises = artists.map(artist => getTopSongsForArtistID(spotifyToken, artist.id));
        const tracks = await Promise.all(tracksPromises);
        
        const combinedTracks = tracks.flat(); // Flatten the tracks array
        setSongs(combinedTracks);
        setCurrentSongs(pickRandomSongs(combinedTracks, 2)); // Pick 2 random songs
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtistsAndTracks();
  }, []);

  const pickRandomSongs = (songs, number) => {
    let randomSongs = [];
    let usedIndices = new Set();

    while(randomSongs.length < number && randomSongs.length < songs.length) {
      let randomIndex = Math.floor(Math.random() * songs.length);
      if (!usedIndices.has(randomIndex)) {
        randomSongs.push(songs[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    return randomSongs;
  };
  const handleSongSelection = (selectedSongIndex) => {
    const newRandomSong = pickRandomSongs(songs, 1)[0];

    setUserChoice(currentSongs[selectedSongIndex]);
    setCorrectChoice(currentSongs[0]); // Correct song is always the first one in the queue
  
    if (currentSongs[selectedSongIndex].popularity >= currentSongs[0].popularity) {
      setScore(prevScore => prevScore + 1);
      setResult('Correct');
    } else {
      setLives(prevLives => prevLives - 1);
      setResult('Incorrect');
    }
  
    setShowResult(true);
  
    setTimeout(() => {
      const nextSongs = [...currentSongs, newRandomSong].slice(1); // Remove the first song and add a new random song
      setCurrentSongs(nextSongs);
      setShowResult(false);  // Hide result and show next question
    }, 3000);  // Adjust time as needed
  
    if (lives <= 0) {
      navigation.navigate('ScoreScreen', { score });
    }
  };

return (
  <View style={styles.container}>
    {isLoading ? (
      <Text>Loading...</Text>
    ) : (
      <>
        <Text style={styles.title}>Choose the More Popular Song</Text>
        <Text>Lives: {lives}</Text>
        <Text>Score: {score}</Text>
        {currentSongs.map((song, index) => (
          <TouchableOpacity key={song.id} onPress={() => handleSongSelection(index)}>
            <Image source={{ uri: song.albumCover }} style={styles.albumCover} />
            <Text>{song.name} - {song.artist}</Text>
            {showResult && userChoice && song.id === userChoice.id && (
              <Text>{result} - Popularity: {song.popularity}</Text>
            )}
          </TouchableOpacity>
        ))}
      </>
    )}
  </View>
);
};

// Styles
const styles = StyleSheet.create({
  // Add your styles here
  albumCover: {
    width: 100,
    height: 100
  },
  // ...
});

export default GameScreen;






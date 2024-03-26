import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getTopArtists, getTopSongsForArtistID } from '../../scripts/SpotifyApiRequests';
import { parseTokenFromInfo } from '../../scripts/SaveUserData';

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
    const selectedSong = currentSongs[selectedSongIndex];
    const otherSong = currentSongs[selectedSongIndex === 0 ? 1 : 0];

    setUserChoice(selectedSong);
    setCorrectChoice(selectedSong.popularity >= otherSong.popularity ? selectedSong : otherSong);

    let isCorrect = selectedSong.popularity >= otherSong.popularity;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setResult('Correct');
    } else {
      // Delay the update of lives and potential navigation to score screen
      setTimeout(() => {
        setLives(prevLives => {
          if (prevLives - 1 <= 0) {
            navigation.navigate('ScoreScreen', { score });
            return prevLives;
          } 
          return prevLives - 1;
        });
      }, 3000); // Delay to show result before redirecting
      setResult('Incorrect');
    }
    
    setShowResult(true);

    if (isCorrect || lives > 1) {
      setTimeout(() => {
        const newRandomSong = pickRandomSongs(songs, 1)[0];
        const nextSongs = [...currentSongs, newRandomSong].slice(1); // Remove the first song and add a new random song
        setCurrentSongs(nextSongs);
        setShowResult(false);  // Hide result and show next question
      }, 3000);  // Adjust time as needed
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
<TouchableOpacity style={styles.quitButton} onPress={() => navigation.navigate('Dashboard')}>
  <Text style={styles.quitButtonText}>Quit</Text>
</TouchableOpacity>

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
  quitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f44336', // or any color you prefer
    borderRadius: 5,
    alignItems: 'center',
  },
  quitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ...
});

export default GameScreen;






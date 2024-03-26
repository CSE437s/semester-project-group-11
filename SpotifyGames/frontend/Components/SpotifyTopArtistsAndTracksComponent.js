import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getTopArtists, getTopSongsForArtistID } from '../../scripts/SpotifyApiRequests'; 
import { parseTokenFromInfo } from '../../scripts/SaveUserData';

const SpotifyTopArtistsAndTracksComponent = () => {
    const [artistsAndTracks, setArtistsAndTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                console.log("ARTISTS?????",artists);
                const tracksPromises = artists.map(artist => getTopSongsForArtistID(spotifyToken, artist.id));
                const tracks = await Promise.all(tracksPromises);
                
                const artistsTracks = artists.map((artist, index) => {
                    return {
                        ...artist,
                        topTracks: tracks[index].slice(0, 5)  // only take the first 5 tracks
                    };
                });
                
                setArtistsAndTracks(artistsTracks);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchArtistsAndTracks();
    }, []);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!artistsAndTracks) {
        return <Text>No top artists and tracks found or not logged in.</Text>;
    }

    return (
        <View>
            {artistsAndTracks.map((artistData, index) => (
                <View key={artistData.id} style={styles.artistContainer}>
                    <Text>{index + 1}. {artistData.name} - Popularity: {artistData.popularity}</Text>
                    {artistData.topTracks.map((track, trackIndex) => (
                        <View key={trackIndex} style={styles.trackContainer}>
                            <Image source={{ uri: track.albumCover }} style={styles.albumCover} />

                            <Text>Track: {track.name} - Popularity: {track.popularity}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    // ... your other styles ...
    albumCover: {
      width: 100,  // Set the width as needed
      height: 100, // Set the height as needed
      // Add other styling as necessary
    },
    // ... your other styles ...
  });


export default SpotifyTopArtistsAndTracksComponent;

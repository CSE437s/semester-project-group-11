import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getTopArtists, getTopSongsForArtistID } from '../../scripts/SpotifyApiRequests';
import { parseTokenFromInfo, getFromCrossPlatformStorage } from '../../scripts/SaveUserData';

const SpotifyTopArtistsComponent = () => {
    const [topArtists, setTopArtists] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fn = async () => {
            let spotifyInfo = await getFromCrossPlatformStorage("spotifyInfo");
            const spotifyToken = parseTokenFromInfo(spotifyInfo);

            if (spotifyToken) {
                getTopArtists(spotifyToken).then((artists) => {
                    setTopArtists(artists);
                    setIsLoading(false);
                }).catch(error => {
                    console.error('Error fetching top artists:', error);
                    setIsLoading(false);
                });
            }
        }
        fn();
    }, [/* dependencies if any */]);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!topArtists) {
        return <Text>No top artists found or not logged in.</Text>;
    }

    return (
        <View>
            {topArtists.map((artist, index) => (
                <Text key={artist.id}>
                    {index + 1}. {artist.name} - Popularity: {artist.popularity}
                </Text>
            ))}
        </View>
    );
};

export default SpotifyTopArtistsComponent;


import { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { getProfile } from '../../scripts/SpotifyApiRequests';

const SpotifyProfileComponent = ({ spotifyToken }) => {

    const [spotifyProfile, setSpotifyProfile] = useState(null);
    const [spotifyProfilePictureURL, setSpotifyProfilePictureURL] = useState(null);

    useEffect(() => {

        const getProfileData = async () => {
            try {
                if (spotifyToken !== null) {
                    const data = await getProfile(spotifyToken);
                    setSpotifyProfile(data);
                    if (data.images[0]) {
                        console.log(data.images)
                        setSpotifyProfilePictureURL(data.images[0].url)
                    }
                }
            }
            catch (error) {
                console.log(error)
            }
        }

        getProfileData();
    }, [spotifyProfile, spotifyProfilePictureURL])

    return (
        <>
            {spotifyProfile !== null ? (
                <>
                    <Image source={{ uri: spotifyProfilePictureURL != null ? spotifyProfilePictureURL : "icon.png" }} />
                    <Text>User ID: {spotifyProfile.id}</Text>
                    <Text>Email: {spotifyProfile.email}</Text>
                    <Text>Spotify URI: {spotifyProfile.uri}</Text>
                    <Text> {spotifyProfile.images[0]?.url ?? '(no profile image)'} </Text>
                </>
            ) : (
                <>
                    <Text>Log in to see your Spotify Profile</Text>
                    {/* maybe replace with a spotify logo or something similar */}
                </>
            )}
        </>
    );
};

export default SpotifyProfileComponent;

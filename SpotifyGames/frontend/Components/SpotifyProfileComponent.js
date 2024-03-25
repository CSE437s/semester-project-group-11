import { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { getProfile } from '../../scripts/SpotifyApiRequests';
import { parseTokenFromInfo } from '../../scripts/SaveUserData';

const SpotifyProfileComponent = () => {

    const [firebaseProfile, setFirebaseProfile] = useState(null);
    const [spotifyProfile, setSpotifyProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [spotifyProfilePictureURL, setSpotifyProfilePictureURL] = useState(null);

    useEffect(() => {
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
                    localStorage.setItem("spotifyProfile", data);
                    
                    // if (data.images[0]) {
                    //     console.log(data.images)
                    //     setSpotifyProfilePictureURL(data.images[0].url)
                    // }
                }
            }
            catch (error) {
                console.log("getProfileDataError",error)
            }
            setIsLoading(false);
        }

        //TEMP FIX: add a delay to not overrequest from spotify
        // const delay = 500; // 5 second delay
        // const timeoutId = setTimeout(() => {
        //     getProfileData();
        // }, delay);
        // return () => clearTimeout(timeoutId);

        getProfileData();
    }, [])

    if (isLoading){
        return ( 
        <View>
            <Text>Loading Profile...</Text>            
        </View>
        )
    }

    return (
        <>
            {spotifyProfile ? (
                <>
                    {/* <Image source={{ uri: spotifyProfilePictureURL != null ? spotifyProfilePictureURL : "icon.png" }} /> */}
                    <Text>User ID: {spotifyProfile.id}</Text>
                    <Text>Email: {spotifyProfile.email}</Text>
                    <Text>Spotify URI: {spotifyProfile.uri}</Text>
                    {/* <Text> {spotifyProfilePictureURL == null ?  spotifyProfilePictureURL : '(no profile image)'} </Text> */}
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

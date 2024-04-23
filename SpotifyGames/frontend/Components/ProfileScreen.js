import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { ListItem, Avatar } from "@rneui/base";
import { useState, useEffect } from "react";
import styles from "./Styles";
import { getFromCrossPlatformStorage, getUserDataFromFirestore, parseTokenFromInfo } from "../../scripts/SaveUserData";
import { getTopArtists, getProfile } from "../../scripts/SpotifyApiRequests";


const ProfileScreen = ({ navigation }) => {
    const [firebaseProfile, setFirebaseProfile] = useState(null);
    const [spotifyProfile, setSpotifyProfile] = useState(null);
    const [topArtists, setTopArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (!isLoading) {
            return;
        }

        const getProfileData = async () => {
            let spotifyInfo = await getFromCrossPlatformStorage("spotifyInfo");
            const spotifyToken = parseTokenFromInfo(spotifyInfo);
            console.log("spotifyTOKEN", spotifyToken);

            try {
                if (spotifyToken !== null) {
                    const data = await getProfile(spotifyToken);
                    console.log("DATA", data);
                    setSpotifyProfile(data);

                    const artists = await getTopArtists(spotifyToken);

                    if (artists) {
                        setTopArtists(artists);
                    }
                }
            } catch (error) {
                console.log("getProfileDataError", error);
            }
            setIsLoading(false);
        };

        const retrieveFirebase = async () => {
            const data = await getUserDataFromFirestore();
            console.log("Firebase Data in profile:", data);
            setFirebaseProfile(data);
        }

        getProfileData();
        retrieveFirebase();
        setIsLoading(false);
    }, []);

    const renderGameScorePair = ({ item }) => {
        // console.log("ITEM",item);

        return (
            <Text>
                {item.key}: {item.value}
            </Text>
        );
    };

    function renderArtistItem({ item, index }) {
        // console.log("ARTIST ITEM PARAMS", index);
        return (<>
            {/* <Text>{index + 1}. {artist.name} - Popularity: {artist.popularity}</Text>
          <Text>Genres: {artist.genres}</Text> */}
            {/* <View> */}

            <ListItem bottomDivider>
                {item.images[0] && <Avatar source={{ uri: item.images[0].url }} size={"medium"} rounded />}
                <ListItem.Content>
                    <ListItem.Title>{index + 1}. {item.name}</ListItem.Title>
                    <ListItem.Subtitle>Popularity: {item.popularity}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            {/* </View> */}
        </>);
    }


    function renderFriend({ item, index }) {
        return (

            <>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Your friend here</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </>
        )
    }

    if (isLoading) {
        return (
            <View>
                <Text>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <>
            {/* <View style={{flex: 1}}> */}
            <View style={styles.container}>

                <View style={{ flex: 1 }}>

                    {firebaseProfile && <View>
                        <Text style={styles.title}>{firebaseProfile.username}'s Profile:</Text>

                        {firebaseProfile.scores && <>
                            <Text>Your High Scores</Text>

                            <FlatList
                                data={Object.entries(firebaseProfile.scores).map(([key, value]) => ({ key, value }))}
                                renderItem={renderGameScorePair}
                                keyExtractor={(item) => item.key}
                            />
                        </>}


                        {/* <Text>Your Friends</Text>

                        <FlatList
                            data={Object.entries(firebaseProfile.friends).map(([key,value]) => ({ key, value}))}
                            renderItem={renderFriend}
                            keyExtractor={(item) => item.key}
                        /> */}

                    </View>
                    }

                    {spotifyProfile ? (
                        <>
                            {topArtists ? (
                                <>
                                    <View style={{ flex: 1, flexGrow: 1 }}>
                                        <Text style={styles.subtitle}>Your Top Artists:</Text>
                                        <FlatList
                                            scrollEnabled
                                            data={topArtists}
                                            renderItem={renderArtistItem}
                                            keyExtractor={(item, index) => {
                                                // console.log(index, item.id);
                                                return item.id;
                                            }}
                                            contentContainerStyle={{ flexGrow: 1 }}
                                        />

                                        <Text>User ID: {spotifyProfile.id}</Text>
                                        <Text>Email: {spotifyProfile.email}</Text>
                                        <Text>Spotify URI: {spotifyProfile.uri}</Text>

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
                            <View>
                                {/* <Text>Your Profile:</Text> */}
                                <Text>You are not logged into Spotify</Text>
                            </View>
                        </>
                    )}

                    <Pressable
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ color: "white" }}>Go back</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
};

export default ProfileScreen;

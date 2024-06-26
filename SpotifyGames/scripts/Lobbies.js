import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";
import { getUserFirebaseInfo } from "./SaveUserData";
import { ref, set, push, getDatabase, get, child } from 'firebase/database';
import { trackNumberLimit } from "./SpotifyApiRequests";

const numSongsToAddToGamePool = 10;

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getSubMapFromArray(songs, indices, user) {
    let submap = {};

    indices.forEach(index => {
        let song = songs[index];
        const songId = song.id;
        submap[songId] = {...song, userId: user.uid}
    });

    return submap;
}

export const onLobbyJoin = async (gameCode) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        console.log("USER NOT LOGGED IN WHEN TRYING TO JOIN LOBBY");
        return;
    }

    const db = getDatabase(app);
    const userData = await getUserFirebaseInfo();
    if (!userData.topSongs || userData.topSongs.length === 0) {
        console.error('No top songs available for the user:', user.uid);
        return;
    }

    const username = userData.username;
    const userRef = ref(db, `lobbies/${gameCode}/users/${user.uid}`);
    console.log("vals:", user.uid, username, userData.topSongs);

    // Update user with username and basic data, not song data
    await set(userRef, { username: username, userId: user.uid, score: 0 });

    const songPoolRef = ref(db, `lobbies/${gameCode}/songPool/${user.uid}`);

    // Create an object to store songs under user's ID
    // let songsData = {};

    // console.log("USER SONG DATA FROM FIREBASE", userData);

    let songs = userData.topSongs;


    let songIndicies = Array.from({ length: trackNumberLimit }, (_, i) => i);

    shuffleArray(songIndicies);

    if (numSongsToAddToGamePool > trackNumberLimit){
        console.log("TRYING TO GET MORE SONGS THAN THERE ARE IN FIREBASE, WHICH WILL CAUSE AN ERROR");
        return;
    }

    const selectedIndicies = songIndicies.slice(0,numSongsToAddToGamePool);

    const songsData = getSubMapFromArray(songs, selectedIndicies, user);

    // userData.topSongs.forEach((song, index) => {
    //     if (index < 5) {  // Assuming you only want to store up to 5 songs per user
    //         const songId = song.id; // Make sure each song has a unique identifier
    //         songsData[songId] = { ...song, userId: user.uid }; // Spread the song data and add user ID
    //     }
    // });

    console.log("Storing songs for user:", user.uid, songsData);
    await set(songPoolRef, songsData);
};

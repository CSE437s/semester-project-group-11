import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";
import { getUserFirebaseInfo } from "./SaveUserData";
import { ref, set, push, getDatabase, get, child } from 'firebase/database';


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
    await set(userRef, { username: username, userId: user.uid });

    const songPoolRef = ref(db, `lobbies/${gameCode}/songPool/${user.uid}`);

    // Create an object to store songs under user's ID
    let songsData = {};
    userData.topSongs.forEach((song, index) => {
        if (index < 5) {  // Assuming you only want to store up to 5 songs per user
            const songId = song.id; // Make sure each song has a unique identifier
            songsData[songId] = {...song, userId: user.uid}; // Spread the song data and add user ID
        }
    });

    console.log("Storing songs for user:", user.uid, songsData);
    await set(songPoolRef, songsData);
};


export const fetchUsersForGame = async (gameCode) => {
    const db = getDatabase(app);
    const lobbyRef = ref(db, `lobbies/${gameCode}/users`);
    const snapshot = await get(lobbyRef);

    if (snapshot.exists()) {
        const usersData = snapshot.val();
        console.log("Fetched users data:", usersData);  // Debugging

        const usersArray = Object.keys(usersData).map(async key => {
            const userSongsRef = ref(db, `lobbies/${gameCode}/songPool/${key}`);
            const songsSnapshot = await get(userSongsRef);
            if (songsSnapshot.exists()) {
                return {
                    uid: key,
                    ...usersData[key],
                    topSongs: Object.values(songsSnapshot.val())  // Check if this matches your structure
                };
            } else {
                console.error(`No songs found for user ${key}`);
                return {
                    uid: key,
                    ...usersData[key],
                    topSongs: []
                };
            }
        });

        return Promise.all(usersArray);  // Ensure asynchronous operations complete
    } else {
        console.error(`No users found in gameCode: ${gameCode}`);
        return [];
    }
};


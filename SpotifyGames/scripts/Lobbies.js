import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";
import { getUserFirebaseInfo } from "./SaveUserData";
import { ref, set, push, getDatabase, get, child } from 'firebase/database';


export const onLobbyJoin = async (gameCode) => {

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user){
        console.log("USER NOT LOGGED IN WHEN TRYING TO JOIN LOBBY");
        return
    }

    const db = getDatabase(app);

    const userData = await getUserFirebaseInfo();

    const username = userData.username;
    let topSongs = userData.topSongs;

    const userRef = ref(db, "lobbies/" + gameCode + "/users/" + user.uid);

    console.log("vals:", user.uid, username, topSongs);

    set(userRef, {
        username: username
    });

    const songPoolRef = ref(db, "lobbies/" + gameCode + "/songPool");

    // randomly select songs from the top songs to include

    let selectedSongs = []

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * topSongs.length);
        selectedSongs.push(topSongs.splice(randomIndex, 1)[0]);
    }

    console.log("SELECTED SONGS", selectedSongs);

    selectedSongs.forEach((song) => {
        console.log("SONG ID", song);
        set(child(songPoolRef, song.id), {
            song:song,
            user:user.uid
        })
    })

    
}
export const fetchUsersForGame = async (gameCode) => {
    const db = getDatabase(app);
    const lobbyRef = ref(db, `lobbies/${gameCode}/users`);
    const snapshot = await get(lobbyRef);

    if (snapshot.exists()) {
        const usersData = snapshot.val();
        // Convert object of objects into an array
        const usersArray = Object.keys(usersData).map(key => {
            return {
                uid: key,
                ...usersData[key],
            };
        });

        // Fetch top songs for each user and add them to the user's object
        for (let user of usersArray) {
            const userSongsSnapshot = await get(ref(db, `lobbies/${gameCode}/songPool/${user.uid}`));
            if (userSongsSnapshot.exists()) {
                user.topSongs = userSongsSnapshot.val();
            } else {
                user.topSongs = [];
            }
        }
        
        return usersArray; // Returns an array of users with their top songs
    } else {
        console.log(`No users found in gameCode: ${gameCode}`);
        return []; // Return an empty array if no users are found
    }
};
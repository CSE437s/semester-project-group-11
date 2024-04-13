import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";
import { getUserFirebaseInfo } from "./SaveUserData";
import { ref, set, push, getDatabase, child } from 'firebase/database';


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
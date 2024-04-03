import { Buffer } from 'buffer';

export async function getProfile(token) {

    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export async function getTopArtists(token) {
    let totalArtists = [];

    // First fetch the top 50 artists
    let result = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    let data = await result.json();
    totalArtists = totalArtists.concat(data.items);

    // The API might allow only up to 50 items per request, so you might not need to make a second call
    // for the next 50 artists. If you do, here's how you could do it:

    // // Check if there are more artists to be fetched
    // if (data.total > 50) {
    //     // Fetch the next 50 artists
    //     result = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=50`, {
    //         method: "GET",
    //         headers: { Authorization: `Bearer ${token}` }
    //     });
    //     data = await result.json();
    //     totalArtists = totalArtists.concat(data.items);
    // }

    return totalArtists;
}

export async function getTopSongsForArtistID(token, artistID){
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=US`, {  // Ensure you specify a market
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    // Map the tracks to a structure that includes only the data you need
    return data.tracks.map(track => ({
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),  // Assuming there can be more than one artist
        popularity: track.popularity,
        albumCover: track.album.images[0].url  // This takes the first image
    }));
}

export async function getAlbumsForArtistID(token, artistID){
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

// https://stackoverflow.com/questions/70660873/how-to-use-spotify-30sec-previews-with-expo-react-native-app
export const getFirstTokenData = async (code, redirect_uri) => {
    var dataToSend = {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    };

    console.log(redirect_uri)

    var formBody = [];
    for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    //POST request
    var response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
            //Header Definition
            'Authorization': 'Basic ' + (new Buffer(process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    })
    try {
        return await response.json();
    } catch (error) {
        console.log("first token error", error);
    }
}


export function calculateExpirationTime(expiresIn) {
    expiresIn = Number(expiresIn);
    const currTime = Date.now();
    const expirationTime = currTime + (expiresIn * 1000);
    return expirationTime;
}


export const getRefreshTokenData = async (refreshToken) => {
    console.log(refreshToken);
    console.log(refreshToken + " going in for refresh")
    var dataToSend = {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    };
    //making data to send on server
    var formBody = [];
    for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    //POST request
    var response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
            //Header Defination
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
        },
    })
    try {
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

// export const getOrRefreshStoredToken = async () => {
//     try {
//         const expirationTime = await getValueFor("SpotifyExpiration");

//         if (expirationTime == null) {
//             console.log("no spotify token found, gotta log in");
//             throw new Error("No Spotify data in SecureStore");
//         }

//         const SpotifyDataString = await getValueFor("SpotifyData");
//         let SpotifyData = JSON.parse(SpotifyDataString);
//         const refreshToken = SpotifyData.refresh_token;

//         const currTime = Date.now();

//         if (expirationTime <= currTime) {
//             console.log("token expired");
//             SpotifyData = await getRefreshTokenData(refreshToken);
//             await save("SpotifyData", JSON.stringify(SpotifyData));
//             await save("SpotifyExpiration", String(calculateExpirationTime(SpotifyData.expires_in)));
//         }


//         if (!SpotifyData) {
//             throw new Error("Spotify Response does not exist in Secure Store");
//         }

//         if (SpotifyData.access_token) {
//             console.log(SpotifyData.access_token)
//             return SpotifyData.access_token
//         }
//     }
//     catch (error) {
//         console.log(error);
//     }
// }
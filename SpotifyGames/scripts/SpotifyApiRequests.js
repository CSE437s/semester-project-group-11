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
    // CHANGED TO 10 TO TRY TO AVOID RATE LIMITING

    let result = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=10`, {
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

function parseArtistNames(arr){
       
    if (arr.length == 1){
        return arr[0].name;
    }

    if (arr.length == 2){
        return arr[0].name + " and " + arr[1].name;
    }

    let combined = "";
    
    for (let i = 0; i < arr.length; i++){
        if (i == arr.length - 1){
            combined += " and " + arr[i].name;
        }
        else{
            combined += arr[i].name + ", ";
        }
    }

    return combined;
}

export async function getTopTracks(token) {
    let tracks = [];

    // First fetch the top 50 tracks

    let result = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    let data = await result.json();
    tracks = tracks.concat(data.items);

    // parsing the data that's useful from this. Feel free to alter if there's other useful stuff

    let extracted = tracks.map((track) => {

        const albumName = track.album.name;
        const albumCover = track.album.images[0].url;

        const artists = parseArtistNames(track.artists);
        const name = track.name;
        const id = track.id;

        const trackInfo = {
            albumName:albumName,
            albumCover:albumCover,
            artists:artists,
            name:name,
            id:id
        }

        return trackInfo;
    });

    return extracted;
}

export async function getTopSongsForArtistID(token, artistID) {
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

export async function getAlbumsForArtistID(token, artistID) {
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
            'Authorization': 'Basic ' + (new Buffer(process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET).toString('base64')),
        },
    })
    try {
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}


export const getUserTopSongs = async (token) => {

    const artists = await getTopArtists(token);
    const tracksPromises = artists.map((artist) =>
        getTopSongsForArtistID(token, artist.id)
    );
    const tracks = await Promise.all(tracksPromises);

    const combinedTracks = tracks.flat(); // Flatten the tracks array

    return combinedTracks;
}


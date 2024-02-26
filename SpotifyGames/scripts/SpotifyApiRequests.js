import { Buffer } from 'buffer';
import { save, getValueFor } from './SecureStore';

export async function getProfile(token) {

    const result = await fetch("https://api.spotify.com/v1/me", {
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
        return await response.json()
    } catch (error) {
        console.log("first token error", error)
    }
}


export function calculateExpirationTime(expiresIn) {
    const currTime = Date.now()
    const expirationTime = currTime + expiresIn * 1000
    return expirationTime
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

export const getOrRefreshStoredToken = async () => {
    try {
        const expirationTime = await getValueFor("SpotifyExpiration");

        if (expirationTime == null) {
            console.log("no spotify token found, gotta log in");
            throw new Error("No Spotify data in SecureStore");
        }

        const SpotifyDataString = await getValueFor("SpotifyData");
        let SpotifyData = JSON.parse(SpotifyDataString);
        const refreshToken = SpotifyData.refresh_token;

        const currTime = Date.now();

        if (expirationTime <= currTime) {
            console.log("token expired");
            SpotifyData = await getRefreshTokenData(refreshToken);
            await save("SpotifyData", JSON.stringify(SpotifyData));
            await save("SpotifyExpiration", String(calculateExpirationTime(SpotifyData.expires_in)));
        }


        if (!SpotifyData) {
            throw new Error("Spotify Response does not exist in Secure Store");
        }

        if (SpotifyData.access_token) {
            console.log(SpotifyData.access_token)
            return SpotifyData.access_token
        }
    }
    catch (error) {
        console.log(error);
    }
}
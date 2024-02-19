import {Buffer} from 'buffer';


export async function getProfile (token) {

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
        'Content-Type':'application/x-www-form-urlencoded'
      },
      json: true
    })
    try{
        return await response.json()
    }catch (error){
        console.log("first token error", error)
    }
}


export const getRefreshTokenData = async (refreshToken) => {
    console.log(refreshToken)
    console.log(refreshToken + " going in for refresh")
    var dataToSend = { 
        refresh_token : refreshToken,
        grant_type: 'refresh_token'};
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
    try{
        return await response.json()
    }catch (error){
        console.log(error)
    }
}
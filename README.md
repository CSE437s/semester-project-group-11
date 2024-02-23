# Semester-Project

## Team Name: <Insert Here>
## Group #: 11
## Contributors: Zach Kuo, Will Triantis, David Ffrench
## TA: <Insert Here>

## Instructions/Link to access: <insert here>


## How to Run:

First, start off by getting the IP address of the computer that will host the server:

Open a terminal and run the following command based on your OS
MacOS:
```
ipconfig getifaddr en0
```

Windows:
```
ipconfig | findstr /C:"IPv4"
```

Next, take the IP address and paste it into SpotifyGames/.env in the section for EXPO_PUBLIC_SERVER_IP


```
cd SpotifyGames
npx expo start
```


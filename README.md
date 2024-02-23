# Semester-Project

## Team Name: <Insert Here>
## Group #: 11
## Contributors: Zach Kuo, Will Triantis, David Ffrench
## TA: <Insert Here>

## Instructions/Link to access: <insert here>


## How to Run:

Exposing the backend to https traffic using ngrok:

assuming ngrok is installed on your machine, you can run the following to redirect traffic from the provided static domain to a port on your machine. For example, I run the following because my domain is "harmless-newly-gecko.ngrok-free.app" and I am using port 16969

```
ngrok http --domain=harmless-newly-gecko.ngrok-free.app 16969
```

the generic version would be as such:

```
ngrok http --domain=[your domain here] [your port here]
```

NOTE: ensure that both of these values are set in the FRONTEND .env file so that the frontend knows where to make requests


For running the backend:

```
cd ExpressBackend
npm run start
```

For running the frontend:

```
cd SpotifyGames
npx expo start
```


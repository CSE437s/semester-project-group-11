import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get('window');

const styles = StyleSheet.create({
  customFonts: {
    fontFamily: "MaterialIcons",
    src: 'url("MaterialIcons.ttf") format("truetype")',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1DB954",
  },
  highLowContainer: {
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#1DB954",
  },
  gameContainer: {
    flex: 1,
  },
  topImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  bottomImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  albumImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    marginBottom: 40,
    color: "#191414",
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 30,
    marginBottom: 15,
    color: "#191414",
    fontWeight: "bold",
  },
  gameTitle: {
    fontSize: 50,
    // marginBottom: 40,
    color: "#191414",
    fontWeight: "bold",
    position: "absolute",
    justifyContent: "center",
    // alignItems: "center",
  },

  inputView: {
    width: "80%",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  textStyleRight: {
    position: "right",
  },
  textStyleLeft: {
    position: "left",
  },
  button: {
    width: "80%",
    backgroundColor: "#191414",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  rouletteButton: {
    width: "15%",
    backgroundColor: "#191414",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  songButton: {
    flex: 1, // Make buttons take up equal space horizontally
    flexDirection: "column", // Arrange image and text horizontally
    padding: 10,
    alignItems: "center", // Align content vertically within button
    marginBottom: 100,
  },
  songImage: {
    width: 50,
    height: 50,
    marginRight: 10, // Add margin between image and text
  },
  songText: {
    flex: 1, // Allow text to expand and fill remaining space
  },
  highLowText: {
    position: "absolute",
    top: 10,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
  },
  rouletteText: {
    flex: 1, // Allow text to expand and fill remaining space
  },
  gameText: {
    color: "white",
  },
  resultText: {
    fontSize: 12, // Adjust result text size if needed
    color: "white", // Optional: Style result text differently
  },
  gameButton: {
    flex: 1,
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#191414",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  landingButton: {
    width: "80%",
    backgroundColor: "#191414",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  inputField: {
    backgroundColor: "black",
  },
  albumCover: {
    flex: 1,
    width: 250,
    height: 250,
    // aspectRatio: 1,
    borderWidth: 10,
    borderColor: "black",
  },
});

export default styles;

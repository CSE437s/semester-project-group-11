import { StyleSheet } from "react-native";

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
  imageContainer: {
    flex: 1,
    flexDirection: "column",
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
  title: {
    fontSize: 50,
    marginBottom: 40,
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
});

export default styles;

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
    title: {
      fontSize: 50,
      marginBottom: 40,
      color: "#191414",
      fontWeight: "bold",
    },
    inputView: {
      width: "80%",
      backgroundColor: "#3AB4BA",
      borderRadius: 25,
      height: 50,
      marginBottom: 20,
      justifyContent: "center",
      padding: 20,
    },
    inputText: {
      height: 50,
      color: "white",
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
  });

  export default styles;
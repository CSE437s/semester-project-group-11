import { signInFirebase } from "../../scripts/FirebaseAuth.js";

import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

import styles from './Styles';
import { ThemeProvider, ThemeConsumer, createTheme } from "@rneui/themed";

export default LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signInFirebase(email, password).then((response) => {
      if (response.user) {
        console.log("logged in");
      } else {
        console.log("log in failed");
      }
    });
  };

  return (
    <>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={{ color: "white" }}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.landingButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ color: "white" }}>Sign Up Here!</Text>
          </TouchableOpacity>
        </View>

    </>
  );
};

//https://alitalhacoban.medium.com/basic-login-screen-with-react-native-c9f7fdcc8dae
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#1DB954",
//   },
//   title: {
//     fontSize: 50,
//     marginBottom: 40,
//     color: "#191414",
//     fontWeight: "bold",
//   },
//   inputView: {
//     width: "80%",
//     backgroundColor: "#3AB4BA",
//     borderRadius: 25,
//     height: 50,
//     marginBottom: 20,
//     justifyContent: "center",
//     padding: 20,
//   },
//   inputText: {
//     height: 50,
//     color: "white",
//   },
//   loginButton: {
//     width: "80%",
//     backgroundColor: "#191414",
//     borderRadius: 25,
//     height: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 40,
//     marginBottom: 10,
//   },
//   landingButton: {
//     width: "80%",
//     backgroundColor: "#191414",
//     borderRadius: 25,
//     height: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 40,
//     marginBottom: 10,
//   },
// });

import { signInFirebase } from "../../scripts/FirebaseAuth.js";

import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      <Button color="#191414" title="Login" onPress={handleSubmit} />

      <Button
        color="#191414"
        title="Go to Landing"
        onPress={() => navigation.navigate("Landing")}
      />
    </View>
  );
};

//https://alitalhacoban.medium.com/basic-login-screen-with-react-native-c9f7fdcc8dae
const styles = StyleSheet.create({
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
  input: {
    height: 50,
    width: "80%",
    backgroundColor:"#3AB4BA",
    borderRadius: 25,
    borderColor: "#191414",
    // borderWidth: 2,
    marginBottom: 20,
    justifyContent:"center",
    // paddingLeft: 8,
    padding: 20,
    color: "#191414",
  },
});

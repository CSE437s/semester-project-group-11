import { signUpFirebase } from "../../scripts/FirebaseAuth.js";
import { addUser } from "../../scripts/FirebaseFirestore.js";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

export default RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    async function registerUser() {
      try {
        const response = await addUser(username, email);

        if (response && response.status === 200) {
          signUpFirebase(email, password);
        } else {
          alert(response.response.data.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
    registerUser();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          value={email}
          onChangeText={handleUsernameChange}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          value={password}
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
        <Text style={{ color: "white" }}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.landingButton}
        onPress={() => navigation.navigate("Landing")}
      >
        <Text style={{ color: "white" }}>Go to Landing</Text>
      </TouchableOpacity>
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

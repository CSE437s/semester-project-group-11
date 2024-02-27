import { signUpFirebase } from "../../scripts/FirebaseAuth.js";
import { addUser } from "../../scripts/FirebaseFirestore.js";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

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

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={handleUsernameChange}
      />

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
      <Button color="#191414" title="Register" onPress={handleSubmit} />

      <Button
        color="#191414"
        title="Go to Landing"
        onPress={() => navigation.navigate("Landing")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1DB954",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    color: "#191414",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#191414",
    borderWidth: 2,
    marginBottom: 16,
    paddingLeft: 8,
    color: "#191414",
  },
});

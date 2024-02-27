import { signUpFirebase } from "../../scripts/FirebaseAuth.js"
import { addUser, removeUser, validateUniqueUsername } from "../../scripts/FirebaseFirestore.js"
import { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default RegisterScreen = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

        if (!username) {
          alert("please enter a username")
          return;
        }

        if (!password) {
          alert("please enter a password")
          return;
        }

        if (!email) {
          alert("please enter an email")
          return;
        }

        const isUniqueUsernameRes = await validateUniqueUsername(username);

        if (isUniqueUsernameRes && isUniqueUsernameRes.status === 200) {

          signUpFirebase(email, password).then((data) => {
            console.log("DATTTTATATTATATATATATTA", data);
            if (data.user) {
              addUser(username, email).then(() => {
                console.log("added user to both firebase auth and firestore");
              })
                .catch((e) => {
                  console.log(e)
                });
            }
            else {
              console.log("firebase auth failed");
              alert(data.message);
            }
          })
            .catch((e) => console.log(e));
        }
        else {
          console.log("AHHHHHHHHH", isUniqueUsernameRes.response.data);
          console.log(isUniqueUsernameRes.response.data.message);
          alert(isUniqueUsernameRes.response.data.message);
        }

        const response = await addUser(username, email);

      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
    registerUser();
  };

  return (
    <View style={styles.container}>
      <Text>Register</Text>

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
      <Button title="Register" onPress={handleSubmit} />

      <Button title="Go to Landing" onPress={() => navigation.navigate('Landing')} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});


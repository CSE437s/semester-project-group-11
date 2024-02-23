import { signUpFirebase } from "../../scripts/FirebaseAuth.js"
import { addUser, isUniqueUsername, isSanitizedUsername, isUniqueEmail } from "../../scripts/FirebaseFirestore.js"
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

    // isSanitizedUsername(username).then((res) => {
    //   if (res.sanitized) {
    //     const approvedUsername = res.username;
    //     console.log("approved username:", approvedUsername);
    //     isUniqueUsername(approvedUsername).then((isUnique) => {
    //       if (isUnique) {
    //         signUpFirebase(email, password).then((response) => {
    //           if (response && response.user) {
    //             console.log("successfully registered")
    //             addUser(approvedUsername, email)
    //           }
    //           else {
    //             alert("Registration failed. Do you already have an account?")
    //           }
    //         }).catch((error) => {
    //           console.log(error);
    //         })
    //       }
    //       else if (!isUnique) {
    //         alert("user " + approvedUsername + " already exists");
    //       }
    //     })
    //   }
    //   else if (!isSanitized) {
    //     alert(username + " includes illegal characters")
    //   }
    // })

    async function registerUser() {
      try {

        const response = await addUser(username, email);

        if (response && response.status === 200){
          signUpFirebase(email, password);
          alert("Yay! You're registered!");
        }
        else {
          alert(response.response.data.message);
        }

        // const res = await isSanitizedUsername(username);

        // if (!res.sanitized) {
        //   alert(username + " includes illegal characters");
        //   return;
        // }

        // const approvedUsername = res.username;
        // console.log("approved username:", approvedUsername);

        // const uniqueUsername = await isUniqueUsername(approvedUsername);

        // if (!uniqueUsername) {
        //   alert("user " + approvedUsername + " already exists");
        //   return;
        // }

        // const uniqueEmail = await isUniqueEmail(email);
        // if (!uniqueEmail) {
        //   alert(email + " is already in use. Do you already have an account?")
        //   return;
        // }

        // const response = await signUpFirebase(email, password);

        // if (!response || !response.user) {
        //   alert("Registration failed. Do you already have an account?");
        //   return;
        // }

        // const successfullyAddedUser = await addUser(approvedUsername, email);

        // if (!successfullyAddedUser) {
        //   console.log("Error registering");
        //   return;
        // }

        


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


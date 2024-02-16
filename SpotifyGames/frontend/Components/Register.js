import { signUpFirebase } from "../../scripts/firebaseConfig.js"

import { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';

export default Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signUpFirebase(email, password).then((response) => {
        if (response && response.user) {
          console.log("logged in")
        }
        else {
          console.log("log in failed")
        }
      })

  };

  return (
    <View style={styles.container}>
      <Text>Register</Text>

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


import { signUpFirebase } from "../../scripts/FirebaseAuth.js"
import { addUser, isUniqueUsername } from "../../scripts/FirebaseFirestore.js"
import { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';

export default RegisterScreen = ({navigation}) => {

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

    isUniqueUsername(username).then((isUnique) => {
      if (isUnique){
        signUpFirebase(email, password).then((response) => {
          if (response && response.user) {
            console.log("logged in")
            addUser(username, email)
          }
          else {
            console.log("log in failed")
          }
        })
      }
      else{
        alert(username, "is already taken")
      }
    })
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


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import UserLogin from './frontend/Components/UserLogin';

import Login from './frontend/Components/Login.js';
import Register from './frontend/Components/Register.js'
import Logout from './frontend/Components/Logout.js';
import TestProfile from './frontend/Components/TestProfile.js';


export default function App() {
  return (
    <View style={styles.container}>

      < UserLogin />

      <TestProfile/>

      {/* <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" /> */}

      <Login/>
      <Logout/>
      <Register/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
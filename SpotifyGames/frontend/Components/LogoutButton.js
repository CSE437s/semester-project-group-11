import { ThemeProvider } from "@react-navigation/native";
import { signOutFirebase } from "../../scripts/FirebaseAuth.js";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Touchable } from "react-native";
import { TouchableOpacity } from "react-native-web";
import styles from "./Styles.js";

export default LogoutButton = () => {
  const handleLogout = (e) => {
    e.preventDefault();
    signOutFirebase();
  };

  return (
    
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={{color:"white"}}>Logout</Text>
        </TouchableOpacity>
    
  );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 20,
//         marginBottom: 16,
//     },
//     input: {
//         height: 40,
//         width: '80%',
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 16,
//         paddingLeft: 8,
//     },
// });

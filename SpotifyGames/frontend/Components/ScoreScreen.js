import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import styles from "./Styles";
import { ThemeProvider, ThemeConsumer } from "react-native-paper";
import { TouchableOpacity } from "react-native-web";

const ScoreScreen = ({ route, navigation }) => {
  const { score } = route.params; // Receive the score passed from GameScreen

  return (
    <>
        <View style={styles.container}>
          <Text style={styles.title}>Your Score: {score}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={{ color: "white" }}>Go home</Text>
          </TouchableOpacity>
        </View>
      
    </>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
// });

export default ScoreScreen;

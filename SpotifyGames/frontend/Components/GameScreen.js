import React from 'react';
import { View, Text, StyleSheet, Button, Picker } from 'react-native';
import useGameLogic from '../../scripts/GameLogic';
import styles from "./Styles"

const GameScreen = ({ navigation }) => {
  const {
    userSelections,
    handleSelection,
    questions,
    score,
    timeElapsed,
    startGame,
    resetGame,
  } = useGameLogic();

  const handlePickerChange = (itemValue, index) => {
    handleSelection(itemValue, index);
  };

  const renderPicker = (question, index) => (
    <View key={question.id} style={styles.gridItem}>
      <Text>{`Row ${question.row}, Col ${question.col}`}</Text>
      <Text>What is the product?</Text>
      <Picker
        selectedValue={userSelections[index]}
        onValueChange={(itemValue) => handlePickerChange(itemValue, index)}
        mode="dropdown"
        style={styles.pickerStyle}
      >
        {[...Array(9).keys()].map((value) => (
          <Picker.Item label={`${value + 1}`} value={`${value + 1}`} key={value} />
        ))}
      </Picker>
    </View>
  );

  return (
    <View style={stylesGame.container}>
      <Text style={stylesGame.title}>Answer the questions:</Text>
      
      {/* Render Column Labels */}
      <View style={stylesGame.headerRow}>
        {['', '1', '2', '3'].map((label, index) => (
          <View key={`header-${index}`} style={stylesGame.headerItem}>
            <Text>{label}</Text>
          </View>
        ))}
      </View>

      {/* Render Row Labels and Pickers */}
      <View style={stylesGame.gridContainer}>
        {questions.map(renderPicker)}
      </View>
      
      <Button
        title="Submit"
        onPress={() => {
          navigation.navigate('ScoreScreen', { score, timeElapsed });
          console.log('Submit pressed', { score, timeElapsed });
        }}
      />
    </View>
  );
};

const stylesGame = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%', // Take full width
    marginBottom: 10, // Add some space before the grid starts
  },
  headerItem: {
    width: '33.33%', // 3 items per row for labels
    alignItems: 'left',
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%', // Take full width to accommodate the grid
    aspectRatio: 1,
  },
  gridItem: {
    width: '33.33%', // 3 items per row for the grid
    alignItems: 'center',
    padding: 10,
    aspectRatio: 1,
  },
  pickerStyle: {
    width: '100%', // The picker should take the full width of the grid item
  },
});

export default GameScreen;

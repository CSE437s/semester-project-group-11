import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Menu, Provider } from 'react-native-paper'; // Import Menu directly from react-native-paper
import useGameLogic from '../../scripts/GameLogic';

const GameScreen = () => {
  const {
    userSelections,
    handleSelection,
    questions,
    options,
  } = useGameLogic();

  // Create state to manage visibility for each text input individually
  const [visibleInputs, setVisibleInputs] = useState(new Array(questions.length).fill(false));

  const handleInputChange = (text, index) => {
    handleSelection(text, index);
    // Don't hide the menu here to allow for user selection
  };

  // Render function
  return (
    <Provider>
      <View>
        {/* Your other components */}
        {questions.map((question, index) => (
          <View key={question.id}>
            <Text>{question.country}</Text>
            <TextInput
              label="Select an option"
              right={<TextInput.Icon name="menu-down" />}
              onFocus={() => setVisibleInputs(prevState => prevState.map((value, i) => i === index ? true : value))}
              onBlur={() => setVisibleInputs(prevState => prevState.map((value, i) => i === index ? false : value))}
              value={userSelections[index]}
            />
            <Menu
              visible={visibleInputs[index]} // Use the visibility state for this input
              onDismiss={() => setVisibleInputs(prevState => prevState.map((value, i) => i === index ? false : value))}
              anchor={<></>} // Anchor is empty when not focused
            >
              {options.map((option, optionIndex) => (
                <Menu.Item
                  key={optionIndex}
                  onPress={() => {
                    handleInputChange(option, index);
                    setVisibleInputs(prevState => prevState.map((value, i) => i === index ? false : value)); // Close this menu
                  }}
                  title={option}
                />
              ))}
            </Menu>
          </View>
        ))}
      </View>
    </Provider>
  );
};

export default GameScreen;

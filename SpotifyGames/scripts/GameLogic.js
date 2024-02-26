import { useState, useEffect } from 'react';

const useGameLogic = () => {
  const [userSelections, setUserSelections] = useState(Array(9).fill(null));
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const questions = [
    { id: 1, country: 'United States' },
    { id: 2, country: 'France' },
    { id: 3, country: 'Japan' },
    // Add more questions if needed
  ];

  const correctAnswers = [
    'Washington D.C.', 'Paris', 'Tokyo', // Correct answers
    // Add more correct answers if needed
  ];

  const options = [
    'Washington D.C.', 'Paris', 'Tokyo', // Correct answers
    'New York', 'Marseille', 'Osaka', // Incorrect answers
    // Add more options if needed
  ];

  const startTimer = () => {
    setTimer(setInterval(() => {
      setTimeElapsed(prevTime => prevTime + 1);
    }, 1000));
  };

  const stopTimer = () => {
    clearInterval(timer);
    setTimer(null);
  };

  const checkAnswer = (selectedValue, index) => {
    const isCorrect = selectedValue === correctAnswers[index];
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleSelection = (selectedValue, index) => {
    const newSelections = [...userSelections];
    newSelections[index] = selectedValue;
    setUserSelections(newSelections);
    checkAnswer(selectedValue, index);
  };

  const startGame = () => {
    // Reset states for a new game
    setUserSelections(Array(9).fill(null));
    setScore(0);
    setTimeElapsed(0);
    startTimer();
  };

  const resetGame = () => {
    setUserSelections(Array(9).fill(null));
    setScore(0);
    setTimeElapsed(0);
    stopTimer();
  };

  useEffect(() => {
    startGame();
    return () => {
      stopTimer(); // Cleanup function to stop the timer when component unmounts
    };
  }, []);

  return {
    userSelections,
    score,
    timeElapsed,
    startGame,
    handleSelection,
    resetGame,
    questions,
    options,
  };
};

export default useGameLogic;
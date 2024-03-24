import { useState, useEffect } from 'react';

const useGameLogic = () => {
  const [userSelections, setUserSelections] = useState(Array(9).fill(null));
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Generate questions based on the product of row and column
  const questions = [];
  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
      questions.push({
        id: `${row}-${col}`,
        row,
        col,
        answer: `${row * col}`
      });
    }
  }

  const options = Array.from({ length: 9 }, (_, i) => `Answer ${i + 1}`);

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
    const isCorrect = selectedValue === questions[index].answer;
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
    setUserSelections(Array(9).fill(null));
    setScore(0);
    setTimeElapsed(0);
    startTimer();
  };

  const resetGame = () => {
    setUserSelections(Array(9).fill(null));
    setScore(0);
    setTimeElapsed(0);
    startTimer();
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

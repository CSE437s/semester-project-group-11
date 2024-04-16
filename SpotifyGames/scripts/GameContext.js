// GameContext.js
import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext(null);

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [scores, setScores] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const incrementScore = (userId) => {
    setScores(prevScores => ({
      ...prevScores,
      [userId]: (prevScores[userId] || 0) + 1
    }));
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  return (
    <GameContext.Provider value={{ scores, incrementScore, currentQuestionIndex, nextQuestion }}>
      {children}
    </GameContext.Provider>
  );
};

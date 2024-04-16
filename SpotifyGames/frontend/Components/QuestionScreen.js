import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { getUserDataFromFirestore } from '../../scripts/SaveUserData';
import { fetchUsersForGame } from '../../scripts/Lobbies';
import Scoreboard from './Scoreboard'; // Ensure Scoreboard is correctly imported

const QuestionScreen = ({ route }) => {
  const { gameCode, isHost } = route.params; // Pass isHost from wherever you're navigating from
  const [gameData, setGameData] = useState({ users: [], currentSong: null });
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameUsers = await fetchUsersForGame(gameCode);
        if (gameUsers.length === 0) {
          throw new Error('No users found for this game');
        }
        const usersWithSongs = await Promise.all(gameUsers.map(async (user) => {
          const userData = await getUserDataFromFirestore(user.id);
          return { ...user, songs: userData.topSongs || [] };
        }));
        setGameData({ users: usersWithSongs, currentSong: null });
        selectRandomSong(usersWithSongs);  // Ensure users are loaded before selecting a song
      } catch (error) {
        console.error('Failed to fetch game data:', error);
      }
    };
  
    fetchGameData();
  }, [gameCode]);

  const selectRandomSong = (users) => {
    if (!users || users.length === 0) {
        console.error('No users or users have no songs');
        return;
    }

    const randomUserIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomUserIndex];

    if (!randomUser.songs || randomUser.songs.length === 0) {
        console.error('Selected user has no songs');
        return;
    }

    const randomSongIndex = Math.floor(Math.random() * randomUser.songs.length);
    const randomSong = randomUser.songs[randomSongIndex];

    setGameData(prevState => ({
        ...prevState,
        currentSong: { ...randomSong, ownerId: randomUser.id } // Include ownerId in the song data
    }));
};

const handleNextQuestion = () => {
    setQuestionNumber(prev => prev + 1);  // Increment question number
    setAnswered(false);  // Reset the answered flag
    setSelectedUser(null);  // Clear any selected user
    selectRandomSong(gameData.users);  // Pick a new song
};

  const handleAnswer = (userId) => {
    // Check if the selected user's ID matches the user ID of the song's owner
    const isCorrect = userId === gameData.currentSong.ownerId; // Assume ownerId is stored in currentSong

    if (isCorrect) {
        setGameData(prevState => ({
            ...prevState,
            users: prevState.users.map(user => {
                if (user.id === userId) {
                    // Make sure to convert score to a number before incrementing
                    return { ...user, score: (user.score || 0) + 1 };
                }
                return user;
            })
        }));
    }

    // Set answered to true to disable further answers until the next question
    setAnswered(true);

    // Wait a bit before moving to the next question
    setTimeout(() => {
        handleNextQuestion();
    }, 2000); // 2000 milliseconds pause before the next question
};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Scoreboard
        scores={gameData.users}
        onNextQuestion={handleNextQuestion}
        isHost={isHost}
        questionNumber={questionNumber}
      />
      {gameData.currentSong ? (
        <>
          <Text>Pick the user who likes this song:</Text>
          <Text>{`Song: ${gameData.currentSong.name} by ${gameData.currentSong.artists}`}</Text>
          <Image
            source={{ uri: gameData.currentSong.albumCover }}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
          {gameData.users.map((user) => (
            <Button
              key={user.id}
              title={user.username}
              onPress={() => handleAnswer(user.id)}
              disabled={answered}
              color={selectedUser === user.id ? 'blue' : 'grey'}
            />
          ))}
        </>
      ) : (
        <Text>Loading song and user data...</Text>
      )}
    </View>
  );
};

export default QuestionScreen;

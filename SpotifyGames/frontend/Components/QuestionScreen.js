import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../scripts/firebaseConfig';
import { fetchUsersForGame } from '../../scripts/Lobbies';
import Scoreboard from './Scoreboard';

const QuestionScreen = ({ route }) => {
    const { gameCode, isHost } = route.params;
    const [gameData, setGameData] = useState({ users: [], currentSong: null });
    const [questionNumber, setQuestionNumber] = useState(1);
    const [answered, setAnswered] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [hostUID, setHostUID] = useState(null);

    useEffect(() => {
        const fetchUsersAndSongs = async () => {
            try {
                const users = await fetchUsersForGame(gameCode);
                console.log("Fetched users and songs:", users);
                if (users.length === 0) {
                    console.error('No users found for this game');
                } else {
                    console.log('Users with songs:', users.filter(u => u.topSongs && u.topSongs.length > 0));
                    setGameData({ users, currentSong: null });
                    selectRandomSong(users);

                    // Print out the pool of all songs
                    const allSongs = users.reduce((allSongs, user) => {
                        return allSongs.concat(user.topSongs);
                    }, []);
                    console.log("Pool of all songs:", allSongs);
                }
            } catch (error) {
                console.error('Failed to fetch users and songs:', error);
            }
        };

        fetchUsersAndSongs();
    }, [gameCode]);

    useEffect(() => {
        const gameStatusRef = ref(db, `lobbies/${gameCode}/gameStatus`);
        const gameStatusListener = onValue(gameStatusRef, (snapshot) => {
            const gameStatus = snapshot.val();
            if (gameStatus) {
                setQuestionNumber(gameStatus.currentQuestion);
                setHostUID(gameStatus.hostUID);
            }
        });

        return () => {
            gameStatusListener(); // Clean up the listener
        };
    }, [gameCode]);

    const selectRandomSong = (users) => {
        const usersWithSongs = users.filter(user => user.topSongs && user.topSongs.length > 0);
        if (usersWithSongs.length === 0) {
            console.error('No users with songs available');
            return;
        }

        const randomUserIndex = Math.floor(Math.random() * usersWithSongs.length);
        const randomUser = usersWithSongs[randomUserIndex];
        const randomSongIndex = Math.floor(Math.random() * randomUser.topSongs.length);
        const randomSong = randomUser.topSongs[randomSongIndex];

        console.log('Selected song:', randomSong);

        setGameData(prevState => ({
            ...prevState,
            currentSong: { ...randomSong, ownerId: randomUser.id }
        }));
    };

    const handleAnswer = (userId) => {
        setSelectedUser(userId);
        if (gameData.currentSong.ownerId === userId) {
            console.log('Correct answer!');
            // Find the user who answered correctly
            const userIndex = gameData.users.findIndex(user => user.id === userId);
            if (userIndex !== -1) {
                // Create a copy of users array to update the score of the user
                const updatedUsers = [...gameData.users];
                updatedUsers[userIndex].score = (updatedUsers[userIndex].score || 0) + 1; // Increment score
                setGameData(prevState => ({
                    ...prevState,
                    users: updatedUsers
                }));
            }
        } else {
            console.log('Wrong answer!');
        }
        setAnswered(true);
    };

    const handleNextQuestion = () => {
        // Only allow the host to click "Next Question"
        if (hostUID !== isHost) return;

        // Increment question number
        const newQuestionNumber = questionNumber + 1;

        // Update game status
        const gameStatusRef = ref(db, `lobbies/${gameCode}/gameStatus`);
        const newGameStatus = { currentQuestion: newQuestionNumber };
        set(gameStatusRef, newGameStatus)
            .then(() => {
                console.log('Game status updated successfully.');
            })
            .catch((error) => {
                console.error('Error updating game status:', error);
            });

        // Reset answered state and selectedUser
        setAnswered(false);
        setSelectedUser(null);

        // Update question number state
        setQuestionNumber(newQuestionNumber);
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
            <Button
                title="Next Question"
                onPress={handleNextQuestion}
                disabled={hostUID !== isHost} // Disable button for non-host players
            />
        </View>
    );

};

export default QuestionScreen;

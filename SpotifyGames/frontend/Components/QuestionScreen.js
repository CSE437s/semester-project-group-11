import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { ref, set, onValue, runTransaction, get } from 'firebase/database';
import { db, auth } from '../../scripts/firebaseConfig';
import Scoreboard from './Scoreboard';

const QuestionScreen = ({ route }) => {
    const { gameCode } = route.params;
    const [users, setUsers] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [answered, setAnswered] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [hostUID, setHostUID] = useState(null);
    const [questions, setQuestions] = useState([]);

    const user = auth.currentUser;


    // Single-run setup things
    useEffect(() => {

        const fetchUsers = async () => {
            const usersRef = ref(db, `lobbies/${gameCode}/users`);
            get(usersRef).then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("Couldn't find users");
                    return;
                }
                const players = snapshot.val();

                let users = [];

                console.log(players);

                for (const [key, val] of Object.entries(players)) {
                    console.log(key, val);
                    users.push(val);
                }
                setUsers(users);
            })
        };

        fetchUsers();

        const getQuestions = async () => {
            const questionsRef = ref(db, `lobbies/${gameCode}/questions`);
            get(questionsRef).then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("Questions does not exist in database at time", Date.now());
                    return;
                }
                const qs = snapshot.val();
                // console.log("QUESTIONS?????", qs);
                setQuestions(qs);
                setCurrentSong(qs[0]);
            });
        }

        getQuestions();

        const getHost = async() => {
            const gameHostRef = ref(db, `lobbies/${gameCode}/gameStatus/hostUID`);
            get(gameHostRef).then((snapshot) => {
                if (snapshot.exists()){
                    const host = snapshot.val();
                    setHostUID(host);
                }
            })
        }

        getHost();
    }, []);


    // Event listener to update the scores of the users
    useEffect(() => {
        const usersRef = ref(db, `lobbies/${gameCode}/users`);
        const scoreListener = onValue(usersRef, (snapshot) => {
            if (!snapshot.exists()) {
                console.log("Couldn't find users");
                return;
            }
            const players = snapshot.val();

            let users = [];

            console.log(players);

            for (const [key, val] of Object.entries(players)) {
                console.log(key, val);
                users.push(val);
            }
            console.log("USERS FROM UDPATED SCORE CALL", users);
            setUsers(users);
        });

        return () => {
            scoreListener();
        }
    }, []);

    // Game over Listener
    useEffect(() => {
        const gameOverRef = ref(db, `lobbies/${gameCode}/gameStatus/isOver`);
        const gameOverListener = onValue(gameOverRef, (snapshot) => {
            if (!snapshot.exists()){
                console.log("cannot find game over flag");
                return;
            }
            const isOver = snapshot.val();
            if (isOver){
                // HANDLE END GAME STUFF HERE
                alert("game is over!");
                // NAVIGATE TO SCORE SCREEN TO SHOW RESULTS???
            }
        });

        return () => {
            gameOverListener();
        }
    }, []);


    // Round Number Listener
    useEffect(() => {
        const questionNumberRef = ref(db, `lobbies/${gameCode}/gameStatus/questionNumber`);
        const gameNextQuestionListener = onValue(questionNumberRef, (snapshot) => {
            if (!snapshot.exists()){
                console.log("cannot find question number in question number listener");
                return;
            }
            const newQuestionNum = snapshot.val();

            setAnswered(false);
            setSelectedUser(null);
            setQuestionNumber(newQuestionNum);
            console.log("NEW QUESTION NUMBER?", newQuestionNum);
            console.log("next question is:", newQuestionNum, questions[newQuestionNum]);
            setCurrentSong(questions[newQuestionNum]);
        });

        return () => {
            gameNextQuestionListener();
        }

    }, [questions]);

    
    const handleAnswer = (userId) => {

        setSelectedUser(userId);
        if (currentSong.userId === userId) {
            console.log('Correct answer!');
            const userScoreRef = ref(db, `lobbies/${gameCode}/users/${user.uid}/score`);
            runTransaction(userScoreRef, (score) => {
                if (typeof score !== 'undefined') {
                    score++;
                    console.log("new score for curr user is", score);
                }
                else {
                    console.log("transaction failed");
                }
                return score;
            })
                .then(() => {
                    console.log('Score updated successfully.');
                })
                .catch((error) => {
                    console.error('Error updating game status:', error);
                });
        } else {
            console.log('Wrong answer!');
        }
        setAnswered(true);
    };

    const handleNextQuestion = () => {
        // Only allow the host to click "Next Question"
        if (hostUID !== user.uid) return;

        // Update game status
        const gameStatusRef = ref(db, `lobbies/${gameCode}/gameStatus`);
        let newQuestionNumber;

        runTransaction(gameStatusRef, (status) => {
            if (status && status.questionNumber !== undefined && status.totalQuestions) {

                if (status.questionNumber === (status.totalQuestions-1)){
                    // HANDLE END GAME LOGIC HERE OR IN GAME OVER EVENT LISTENER!!!!
                    status.isOver = true;
                    return status;
                }
                // console.log(status);
                const next = status.questionNumber + 1;
                status.questionNumber = next;
                newQuestionNumber = next;
            }
            else {
                console.log("transaction failed");
            }
            return status;
        })
            .then(() => {
                console.log('Game status updated successfully.');
            })
            .catch((error) => {
                console.error('Error updating game status:', error);
            });
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Scoreboard
                scores={users}
                onNextQuestion={handleNextQuestion}
                isHost={user.uid === hostUID}
                questionNumber={questionNumber}
            />
            {currentSong ? (
                <>
                    <Text>Pick the user who likes this song:</Text>
                    <Text>{`Song: ${currentSong.name} by ${currentSong.artists}`}</Text>
                    <Image
                        source={{ uri: currentSong.albumCover }}
                        style={{ width: 100, height: 100 }}
                        resizeMode="contain"
                    />
                    {users.map((user) => (
                        <Button
                            key={user.userId}
                            title={user.username}
                            onPress={() => handleAnswer(user.userId)}
                            disabled={answered}
                            color={selectedUser === user.userId ? 'blue' : 'grey'}
                        />
                    ))}
                </>
            ) : (
                <Text>Loading song and user data...</Text>
            )}
            {hostUID === user.uid && <Button
                title="Next Question"
                onPress={handleNextQuestion}
                disabled={hostUID !== user.uid} // Disable button for non-host players
            />}
        </View>
    );
};

export default QuestionScreen;

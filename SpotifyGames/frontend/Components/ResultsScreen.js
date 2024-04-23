import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { ref, set, onValue, runTransaction, get } from 'firebase/database';
import { db, auth } from '../../scripts/firebaseConfig';

const ResultsScreen = ({ route, navigation }) => {
    const { gameCode } = route.params;
    const [users, setUsers] = useState([]);

    const user = auth.currentUser;

    // Single-run setup things
    useEffect(() => {

        const fetchUsersAndSortByScore = async () => {
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

                // Sort users in descending order of score
                users.sort((a, b) => b.score - a.score);

                setUsers(users);
            })
        };

        fetchUsersAndSortByScore();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {users && users.map((userScore, index) => (
                <Text key={index} style={styles.score}>
                    {userScore.username}: {userScore.score}
                </Text>
            ))}

            <Button
                title="Back to Dashboard"
                onPress={ () => {
                    navigation.navigate('Dashboard');
                } }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    score: {
      fontSize: 18,
      marginVertical: 4,
    },
  });
  

export default ResultsScreen;

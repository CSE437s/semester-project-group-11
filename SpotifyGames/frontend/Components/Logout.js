import { signOutFirebase, getAuthStateChangeFirebase } from "../../scripts/firebaseConfig.js";
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

export default Logout = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = getAuthStateChangeFirebase(setIsLoggedIn);
        return () => unsubscribe();
    }, []);


    const handleLogout = (e) => {
        e.preventDefault();
        signOutFirebase();
    };

    return (
        <View style={styles.container}>

            <Button
                disabled={!isLoggedIn}
                title="Logout"
                onPress={handleLogout}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 16,
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
    },
});
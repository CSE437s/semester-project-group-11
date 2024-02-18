import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export async function save(key, value) {
    try{
        await ReactNativeAsyncStorage.setItem(key, value);
    }
    catch (error){
        console.error('Error storing token:', error.message);
    }
    
}

export async function getValueFor(key) {
    try {
        const result = await ReactNativeAsyncStorage.getItem(key);
        return result
    }
    catch (error) {
        console.error('Error retrieving token:', error.message);
    }
}
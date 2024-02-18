import * as React from 'react';
import { getProfile } from '../../scripts/SpotifyApiRequests';
import { Button, View, StyleSheet } from 'react-native';
import {save, getValueFor} from '../../scripts/SecureStore.js'

export default function TestProfile(){
    
    return (
    <>
        <Button
                disabled={!getValueFor("authToken")}
                title="Test Profile"
                onPress={() => {
                    getValueFor("authToken").then((at) => {
                        console.log("hello")
                        console.log("auth token??????", at)
                        getProfile(at).then((res)=>{
                            console.log(res)
                        })
                    })
                }}
            />
            {/* <Button
                disabled={!getValueFor("user")}
                title="Test Firebase Auth"
                onPress={() => {
                    getValueFor("user").then((at) => {
                        console.log("hello")
                        console.log("user ??????", at)

                    })
                }}
            /> */}
    </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
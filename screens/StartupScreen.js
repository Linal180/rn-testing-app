import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Text, View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';

import Colors from '../constants/Colors';
import * as authAction from '../store/actions/auth';
import * as postsActions from '../store/actions/post';
import * as accountActions from '../store/actions/account';

const StartupScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if(!userData){
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData);
            const { token, userId, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);

            if(expirationDate <= new Date() || !token || !userId) {
                props.navigation.navigate('Auth');
                return;
            }
            const expirationTime = expirationDate.getTime() - new Date().getTime();

            props.navigation.navigate('Post');
            dispatch(authAction.authenticate(userId, token, expirationTime));
        };

        tryLogin();
        dispatch(postsActions.fetchPosts());
        dispatch(accountActions.fetchAccounts());
    }, [dispatch])

    return(
        <View style={StyleSheet.screen}>
        <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen;
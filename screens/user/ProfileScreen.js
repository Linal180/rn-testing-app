import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons"

import HeaderButton from '../../components/UI/HeaderButton';


const ProfileScreen = props => {
    return (
        <View><Text>Profile Screen!</Text></View>
    );
};



ProfileScreen.navigationOptions = (navData) => {
    return {
      headerTitle: 'Profile',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      ),
    };
  };
  

const stylles = StyleSheet.create({});

export default ProfileScreen;
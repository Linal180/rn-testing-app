import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Dropdown} from 'react-native-material-dropdown';

import HeaderButton from '../../components/UI/HeaderButton';

const ProfileScreen = (props) => {
  let cities = [
    {
      value: 'Lahore',
    },
    {
      value: 'Islamabad',
    },
    {
      value: 'Peshawar',
    },
  ];

  return (
    <View>
      <Text>Profile Screen!</Text>
      <Dropdown label="Cities" data={cities} dropdownOffset={{top: 80, left: 80}} dropdownMargins={{min: 70, max: 60}} />
    </View>
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

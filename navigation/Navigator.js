import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Ionicons} from '@expo/vector-icons';

import PostsScreen from '../screens/main/PostsScreen';
import MessagesScreen from '../screens/message/MessagesScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import UserPostsScreen from '../screens/user/UserPostsScreen';
import EditPostScreen from '../screens/user/EditPostScreen';
import Colors from '../constants/Colors';


const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};


const PostsNavigator = createStackNavigator(
    {
      Posts: PostsScreen
    },
    {
      navigationOptions: {
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-document' : 'ios-document'}
            size={23}
            color={drawerConfig.tintColor}
          />
        ),
      },
      defaultNavigationOptions: defaultNavOptions,
    }
  );


const UserPostsNavigator = createStackNavigator(
  {
    MyPosts: UserPostsScreen,
    EditPost: EditPostScreen
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-clipboard' : 'ios-document'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);



  const MessagesNavigator = createStackNavigator(
    {
      Inbox: MessagesScreen
    },
    {
      navigationOptions: {
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-chatbubbles' : 'ios-chatbubbles'}
            size={23}
            color={drawerConfig.tintColor}
          />
        ),
      },
      defaultNavigationOptions: defaultNavOptions,
    }
  );



  const UserNavigator = createStackNavigator(
    {
      Account: ProfileScreen
    },
    {
      navigationOptions: {
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
            size={23}
            color={drawerConfig.tintColor}
          />
        ),
      },
      defaultNavigationOptions: defaultNavOptions,
    }
  );

const Navigator = createDrawerNavigator(
  {
    Posts: PostsNavigator,
    MyPosts: UserPostsNavigator,
    Account: UserNavigator,
    Messages: MessagesNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
  }
);



export default createAppContainer(Navigator);

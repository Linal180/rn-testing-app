import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Button,
  Platform,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import {Ionicons} from '@expo/vector-icons';

import PostsScreen from '../screens/main/PostsScreen';
import MessagesScreen from '../screens/message/MessagesScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import UserPostsScreen from '../screens/user/UserPostsScreen';
import EditPostScreen from '../screens/user/EditPostScreen';
import StartupScreen from '../screens/StartupScreen';
import AuthScreen from '../screens/user/AuthScreen';
import PostDetailScreen from '../screens/main/PostDetailScreen';
import AddUserDetailsScreen from '../screens/user/AddUserDetailsScreen';
import SearchScreen from '../screens/main/SearchScreen';
import InboxScreen from '../screens/message/InboxScreen';
import SearchResultsScreen from '../screens/main/SearchResultsScreen';
import SignupScreen from '..//screens/user/SignupScreen';
import Colors from '../constants/Colors';
import UserProfileContent from '../components/main/UserProfileContent';
import HostedRidesHistoryScreen from '../screens/user/HostedRidesHistoryScreen';
import BookedRidesScreen from '../screens/user/BookedRidesScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const AllPostsNavigator = createStackNavigator(
  {
    Posts: PostsScreen,
    PostDetail: PostDetailScreen,
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

const BookedRidesNavigator = createStackNavigator(
  {
    BookedRides: BookedRidesScreen,
    PostDetail: PostDetailScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const HostedRidesNavigator = createStackNavigator(
  {
    HostedRides: UserPostsScreen,
    PostDetail: PostDetailScreen,
    EditPost: EditPostScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const HostedRidesHistoryNavigator = createStackNavigator(
  {
    History: HostedRidesHistoryScreen,
    PostDetail: PostDetailScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);
const tabScreenConfig = {
  Hosted: {
    screen: HostedRidesNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name="md-car" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary,
    },
  },
  History: {
    screen: HostedRidesHistoryNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name="md-time" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary,
    },
  },
};

const tabScreenConfig2 = {
  Posts: {
    screen: AllPostsNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name="md-car" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary,
    },
  },
  BookedRides: {
    screen: BookedRidesNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons name="md-bookmarks" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary,
    },
  },
};

// const UserPostsNavigator = createMaterialTopTabNavigator(tabScreenConfig, {
//   activeColor: 'white',
//   shifting: true,
// });

const UserPostsNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(tabScreenConfig, {shifting: true})
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          activeTintColor: Colors.primary,
        },
      });

const PostsNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(
        tabScreenConfig2,
        {shifting: true},
        {
          navigationOptions: {
            drawerIcon: (drawerConfig) => (
              <Ionicons
                name={
                  Platform.OS === 'android' ? 'md-document' : 'ios-document'
                }
                size={23}
                color={drawerConfig.tintColor}
              />
            ),
          },
        }
      )
    : createBottomTabNavigator(tabScreenConfig2, {
        tabBarOptions: {
          activeTintColor: Colors.primary,
        },
      });

const MessagesNavigator = createStackNavigator(
  {
    Messages: MessagesScreen,
    Inbox: InboxScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={
            Platform.OS === 'android' ? 'md-chatbubbles' : 'ios-chatbubbles'
          }
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const SearchNavigator = createStackNavigator(
  {
    Search: SearchScreen,
    SearchResults: SearchResultsScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
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
    Account: ProfileScreen,
    EditProfileDetails: EditProfileScreen,
    UserDetails: AddUserDetailsScreen,
    Signup: SignupScreen,
    Login: AuthScreen,
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
    Posts: {
      screen: PostsNavigator,
      navigationOptions: {
        drawerLabel: 'Available Rides',
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-car' : 'ios-car-outline'}
            size={23}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
    HostedRides: {
      screen: UserPostsNavigator,
      navigationOptions: {
        drawerLabel: 'Hosted Rides',
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={
              Platform.OS === 'android' ? 'md-bookmark' : 'ios-bookmark-outline'
            }
            size={23}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
    Account: UserNavigator,
    Messages: MessagesNavigator,
    Search: SearchNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => <UserProfileContent {...props} />,
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Post: Navigator,
});

export default createAppContainer(MainNavigator);

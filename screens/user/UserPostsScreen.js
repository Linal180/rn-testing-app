import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {View, Text, StyleSheet, FlatList, Button, Alert} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Post from '../../components/main/post';
import Colors from '../../constants/Colors';
import * as postActions from '../../store/actions/post';


const UserPostsScreen = (props) => {
  const userPosts = useSelector(state => state.posts.userPosts);
  const dispatch = useDispatch();

  const selectPostHandler = (id) => {
    console.log(id,'id')
    props.navigation.navigate('EditPost', {
      postId: id
    });
  };

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this post?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(postActions.deletePost(id));
        }
      }
    ]);
  };


  return (
    <FlatList
      data={userPosts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <Post
          fromCity={itemData.item.fromCity}
          toCity={itemData.item.toCity}
          date={itemData.item.date}
          maxPersons={itemData.item.maxPersons}
          personsJoined={itemData.item.personsJoined}
          fare={itemData.item.fare}
          status={itemData.item.status}
          onSelect={() => {
            selectPostHandler(itemData.item.id);
          }}
        >
          <Button
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
            color={Colors.danger}
          />
        </Post>
      )}
    />
  );
};

UserPostsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'My Posts',
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditPost');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({});

export default UserPostsScreen;

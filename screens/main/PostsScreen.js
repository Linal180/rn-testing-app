import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {View, Text, StyleSheet, FlatList, Button, Alert} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import POSTS from '../../data/dummy-data';
import Post from '../../components/main/post';

const PostsScreen = (props) => {
  const posts = useSelector(state => state.posts.availablePosts);
  const dispatch = useDispatch();



  const joinHandler = (id) => {
    const post = POSTS.find((post) => post.id == id);
    if (post.personsJoined < post.maxPersons && post.status == 'active') {
      post.personsJoined = parseInt(post.personsJoined) + 1;
    } else {
      Alert.alert('Sorry!', 'This post is not available anymore', [
        {text: 'Okay'},
      ]);
    }
  };

  return (
    <FlatList
      data={posts}
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
        >
          <Button
            title="Join"
            onPress={() => {
              joinHandler(itemData.item.id);
            }}
          />
        </Post>
      )}
    />
  );
};

PostsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'All Posts',
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

const styles = StyleSheet.create({});

export default PostsScreen;

import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, FlatList, Button, Alert} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Post from '../../components/main/post1';
import Colors from '../../constants/Colors';
import * as postActions from '../../store/actions/post';

const UserPostsScreen = (props) => {
  const hostedRides = useSelector((state) => state.posts.hostedRides);
  const dispatch = useDispatch();

  const selectPostHandler = (id) => {
    props.navigation.navigate('PostDetail', {
      postId: id,
    });
  };

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this post?', [
      {text: 'No', style: 'default'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(postActions.deletePost(id));
        },
      },
    ]);
  };

  if (hostedRides.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No post found. Maybe start posting some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={hostedRides}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <Post
          post={itemData.item}
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
    headerTitle: 'Hosted Rides',
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
    ),
  };
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserPostsScreen;

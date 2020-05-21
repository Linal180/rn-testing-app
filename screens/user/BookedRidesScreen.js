import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, FlatList, Button, Alert} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Post from '../../components/main/post1';

const BookedRidesScreen = (props) => {
  const bookedRides = useSelector((state) => state.posts.bookedRides);
  const dispatch = useDispatch();

  const selectPostHandler = (id) => {
    props.navigation.navigate('PostDetail', {
      postId: id,
    });
  };

  if (bookedRides.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No post found. Maybe start booking some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookedRides}
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
        ></Post>
      )}
    />
  );
};

BookedRidesScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Booked Rides',
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

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookedRidesScreen;

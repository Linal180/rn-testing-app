import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Post from '../../components/main/post1';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

const SearchResultsScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const posts = useSelector((state) => state.posts.availablePosts);
  const dispatch = useDispatch();

  const joinHandler = (post) => {
    dispatch(postsActions.joinPool(post));
  };

  const selectPostHandler = (id) => {
    props.navigation.navigate('PostDetail', {
      postId: id,
    });
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text>An Error Occured!</Text>
        <Button title="Try Again" onPress={loadPosts} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No post found.</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          
          renderItem={(itemData) => (
            <Post
              post={itemData.item}
              onSelect={() => {
                selectPostHandler(itemData.item.id);
              }}
            >
              <Button
                title="Join"
                onPress={() => {
                  joinHandler(itemData.item);
                }}
              />
            </Post>
          )}
        />
      </ScrollView>
    </View>
  );
};

SearchResultsScreen.navigationOptions = () => {
  return {
    headerTitle: 'Search Results',
  };
};

const styles = StyleSheet.create({
  inputBox: {
    borderColor: 'red',
    borderRadius: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'blue',
  },
  searchText: {
    borderRadius: 64,
    width: '40%',
    maxWidth: 40,
    height: '40%',
    maxHeight: 40,
  },
  searchContainer: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 140,
    margin: 20,
  },
  input: {
    borderColor: 'red',
    color: 'red',
  },
});

export default SearchResultsScreen;

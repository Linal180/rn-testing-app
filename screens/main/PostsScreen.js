import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import POSTS from '../../data/dummy-data';
import Post from '../../components/main/post1';
import * as postsActions from '../../store/actions/post';
import * as poolsActions from '../../store/actions/pools';
import Colors from '../../constants/Colors';
import {TextInput, ScrollView} from 'react-native-gesture-handler';

const PostsScreen = (props) => {
  const [searchShow, setSearchShow] = useState(false);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const posts = useSelector((state) => state.posts.availablePosts);
  const accounts = useSelector((state) => state.account.accounts);
  const dispatch = useDispatch();

  const loadPosts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(postsActions.fetchPosts());
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadPosts);

    return () => {
      willFocusSub.remove();
    };
  }, [loadPosts]);

  useEffect(() => {
    setIsLoading(true);
    loadPosts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadPosts]);

  const joinHandler = (post) => {
    if (moment(post.date).diff(moment()) < 0) {
      Alert.alert(
        'Pool Expired!',
        'Sorry! This pool is expired. Try some other!',
        [{text: 'Okay'}]
      );
      return;
    }
    dispatch(postsActions.joinPool(post));
  };

  const selectPostHandler = (id) => {
    props.navigation.navigate('PostDetail', {
      postId: id,
    });
  };
  const searchShowHandler = () => {
    setSearchShow((prevState) => !prevState);
  };

  const fromCityHandler = (fromCityName) => {
    setFromCity(fromCityName);
  };

  const toCityHandler = (toCityName) => {
    setToCity(toCityName);
  };

  const submitSearchHandler = () => {
    dispatch(postsActions.searchPost(fromCity, toCity));
    setFromCity('');
    setToCity('');
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
          onRefresh={loadPosts}
          refreshing={isRefreshing}
          data={posts}
          inverted={true}
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

PostsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'All Rides',
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

export default PostsScreen;

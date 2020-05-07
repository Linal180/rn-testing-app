import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';

import Navigator from './navigation/Navigator';
import postsReducer from './store/reducers/post';

const rootReducer = combineReducers({
  posts: postsReducer
});

const store = createStore(rootReducer);


export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

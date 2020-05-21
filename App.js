import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';
import ReduxThunk from 'redux-thunk';

import postsReducer from './store/reducers/post';
import authReducer from './store/reducers/auth';
import poolReducer from './store/reducers/pools';
import accountReducer from './store/reducers/account';
import chatReducer from './store/reducers/chat';

import NavigatorContainer from './navigation/NavigatorContainer';

const rootReducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
  pool: poolReducer,
  account: accountReducer,
  chat: chatReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  console.log("APP.js ---");
  return (
    <Provider store={store}>
      <NavigatorContainer />
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

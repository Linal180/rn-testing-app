import React, {useState, useEffect, useReducer, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import Input from '../../components/UI/Input';
import HeaderButton from '../../components/UI/HeaderButton';
import POSTS from '../../data/dummy-data';
import Post from '../../components/main/post';
import Colors from '../../constants/Colors';
import * as postActions from '../../store/actions/post';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditPostScreen = (props) => {
  const postId = props.navigation.getParam('postId');
  const editedPost = useSelector((state) =>
    state.posts.userPosts.find((post) => post.id === postId)
  );
  const dispatch = useDispatch();
  
  const [fromCity, setFromCity] = useState(editedPost ? editedPost.fromCity : '');
  const [toCity, setToCity] = useState(editedPost ? editedPost.toCity : '');
  const [maxPersons, setMaxPersons] = useState(editedPost ? editedPost.maxPersons : '');
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fromCity: editedPost ? editedPost.fromCity : '',
      toCity: editedPost ? editedPost.toCity : '',
      maxPersons: editedPost ? editedPost.maxPersons : '',
      fare: editedPost ? editedPost.fare : '',
    },
    inputValidities: {
      fromCity: editedPost ? true : false,
      toCity: editedPost ? true : false,
      maxPersons: editedPost ? true : false,
      fare: editedPost ? true : false,
    },
    formIsValid: editedPost ? true : false,
  });

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ]);
      return;
    }
    if (editedPost) {
      dispatch(
        postActions.updatePost(
          postId,
          formState.inputValues.fromCity,
          formState.inputValues.toCity,
          formState.inputValues.maxPersons
        )
      );
    } else {
      dispatch(
        postActions.createPost(
          formState.inputValues.fromCity,
          formState.inputValues.toCity,
          formState.inputValues.maxPersons,
          formState.inputValues.fare
        )
      );
    }
    props.navigation.goBack();
  }, [dispatch, postId, formState]);

  useEffect(() => {
    props.navigation.setParams({submit: submitHandler});
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log(inputIdentifier, inputValue, inputValidity, "Setting in inputHandler")
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      // behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="fromCity"
            label="From"
            errorText="Please enter a valid City"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedPost ? editedPost.fromCity : ''}
            initiallyValid={!!editedPost}
            required
          />
          <Input
            id="toCity"
            label="To"
            errorText="Please enter a valid City"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedPost ? editedPost.toCity : ''}
            initiallyValid={!!editedPost}
            required
          />
          <Input
            id="maxPersons"
            label="Maximum Persons"
            errorText="Please enter a valid Integer"
            keyboardType="numeric"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedPost ? editedPost.maxPersons : ''}
            initiallyValid={!!editedPost}
            required
            min={2}
          />
          {editedPost ? null : (
            <Input
              id="fare"
              label="Total Fare"
              errorText="Please enter a valid Amount"
              keyboardType="numeric"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={editedPost ? editedPost.fare : ''}
              initiallyValid={!!editedPost}
              required
              min={900}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditPostScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('postId')
      ? 'Edit Post'
      : 'Add Post',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({});

export default EditPostScreen;

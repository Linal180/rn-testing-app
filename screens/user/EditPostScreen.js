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
  Alert,
  ActivityIndicator,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Ionicons} from '@expo/vector-icons';
import moment from 'moment';

import Input from '../../components/UI/Input';
import HeaderButton from '../../components/UI/HeaderButton';
import POSTS from '../../data/dummy-data';
import Post from '../../components/main/post';
import Colors from '../../constants/Colors';
import * as postActions from '../../store/actions/post';
import DropdownCmp from '../../components/UI/Dropdown';

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
  let data = [
    {value: 'Lahore'},
    {value: 'Islamabad'},
    {value: 'Multan'},
    {value: 'Karachi'},
  ];

  let seatsData = [{value: '1'}, {value: '2'}, {value: '3'}, {value: '4'}];

  let fareData = [
    {value: '1000'},
    {value: '1500'},
    {value: '2000'},
    {value: '3000'},
    {value: '4000'},
  ];
  let dayData = [{value: '12'}, {value: '13'}, {value: '14'}, {value: '15'}];

  let monthData = [
    {value: 'May'},
    {value: 'June'},
    {value: 'July'},
    {value: 'Aug'},
    {value: 'Sept'},
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const postId = props.navigation.getParam('postId');
  const editedPost = useSelector((state) =>
    state.posts.userPosts.find((post) => post.id === postId)
  );
  
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedPost) {
        await dispatch(
          postActions.updatePost(
            postId,
            formState.inputValues.fromCity,
            formState.inputValues.toCity,
            formState.inputValues.maxPersons
          )
        );
      } else {
        let d = `${formState.inputValues.day}-${moment()
          .month(formState.inputValues.month)
          .format('M')}-2020`;

        await dispatch(
          postActions.createPost(
            formState.inputValues.fromCity,
            formState.inputValues.toCity,
            formState.inputValues.maxPersons,
            formState.inputValues.fare,
            moment(d, 'DO-MM-YYYY')
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch, postId, formState]);

  useEffect(() => {
    props.navigation.setParams({submit: submitHandler});
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log(inputValidity, 'input changed', inputValue, inputValidity);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      // behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.container}>
            <Text style={{paddingTop: 27, paddingLeft: 10}}>
              <Ionicons
                name={Platform.OS === 'android' ? 'md-pin' : 'ios-pin-outline'}
                size={35}
              />
            </Text>
            <View style={styles.left}>
              <DropdownCmp
                id="fromCity"
                label="From"
                data={data}
                errorText="Please enter a valid City"
                initialValue={editedPost ? editedPost.fromCity : ''}
                initiallyValid={!!editedPost}
                onInputChange={inputChangeHandler}
              />
            </View>
            <View style={styles.right}>
              <DropdownCmp
                id="toCity"
                label="To"
                data={data}
                errorText="Please enter a valid City"
                initialValue={editedPost ? editedPost.toCity : ''}
                initiallyValid={!!editedPost}
                onInputChange={inputChangeHandler}
              />
            </View>
          </View>

          <View style={styles.container}>
            <Text style={{paddingTop: 27, paddingLeft: 10}}>
              <Ionicons
                name={
                  Platform.OS === 'android'
                    ? 'md-information-circle'
                    : 'ios-information-circle'
                }
                size={35}
              />
            </Text>
            <View style={styles.left}>
              <DropdownCmp
                id="maxPersons"
                label="Available Seats"
                data={seatsData}
                errorText="Please select available seats"
                initialValue={editedPost ? editedPost.maxPersons : ''}
                initiallyValid={!!editedPost}
                onInputChange={inputChangeHandler}
              />
            </View>
            <View style={styles.right}>
              {editedPost ? null : (
                <DropdownCmp
                  id="fare"
                  label="Fare"
                  data={fareData}
                  initialValue={editedPost ? editedPost.fare : ''}
                  initiallyValid={!!editedPost}
                  errorText="Please select estimated Fare Range"
                  onInputChange={inputChangeHandler}
                />
              )}
            </View>
          </View>
          {editedPost ? null : (
            <View>
              <View style={styles.container}>
                <Text style={{paddingTop: 27, paddingLeft: 10}}>
                  <Ionicons
                    name={
                      Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'
                    }
                    size={35}
                  />
                </Text>
                <View style={styles.left}>
                  <DropdownCmp
                    id="day"
                    label="Day"
                    data={dayData}
                    errorText="Please select a day."
                    onInputChange={inputChangeHandler}
                  />
                </View>
                <View style={styles.right}>
                  <DropdownCmp
                    id="month"
                    label="Month"
                    data={monthData}
                    errorText="Please select a month."
                    onInputChange={inputChangeHandler}
                  />
                </View>
              </View>
            </View>
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
    headerRight: () => (
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

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    width: 135,
  },
  right: {
    width: 135,
    paddingRight: 10,
  },
});

export default EditPostScreen;

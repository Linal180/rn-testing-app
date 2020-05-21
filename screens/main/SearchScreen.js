import React, {useReducer, useEffect, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {Text, View, Button, StyleSheet, Platform, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import DropdownCmp from '../../components/UI/Dropdown';
import Colors from '../../constants/Colors';
import * as postsAction from '../../store/actions/post';

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

const SearchScreen = (props) => {
  const [error, setError] = useState(null);
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
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      from: '',
      to: '',
      availableSeats: '',
      fareRange: '',
      day: '',
      month: '',
    },
    inputValidities: {
      from: true,
      to: true,
      availableSeats: true,
      fareRange: true,
      day: true,
      month: true,
    },
    formIsValid: true,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{text: 'Okay'}]);
    }
  }, [error, dispatch]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log(inputIdentifier, ' changed to', inputValue);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const submitHandler = async () => {
    setError(null);
    try {
      await dispatch(
        postsAction.searchPost(
          formState.inputValues.from,
          formState.inputValues.to,
          formState.inputValues.availableSeats,
          formState.inputValues.fareRange,
          formState.inputValues.day,
          formState.inputValues.month
        )
      );
      formState.inputValues.from = '';
      formState.inputValues.to = '';
      formState.inputValues.availableSeats = '';
      formState.inputValues.fareRange = '';
      formState.inputValues.day = '';
      formState.inputValues.month = '';
      props.navigation.navigate('SearchResults');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={{paddingTop: 27, paddingLeft: 10}}>
          <Ionicons
            name={Platform.OS === 'android' ? 'md-pin' : 'ios-pin-outline'}
            size={35}
          />
        </Text>
        <View style={styles.left}>
          <DropdownCmp
            id="from"
            label="From"
            value=""
            data={data}
            onInputChange={inputChangeHandler}
          />
        </View>
        <View style={styles.right}>
          <DropdownCmp
            id="to"
            label="To"
            value=""
            data={data}
            onInputChange={inputChangeHandler}
          />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={{paddingTop: 27, paddingLeft: 10}}>
          <Ionicons
            name={Platform.OS === 'android' ? 'md-car' : 'ios-car-outline'}
            size={35}
          />
        </Text>
        <View style={styles.left}>
          <DropdownCmp
            id="availableSeats"
            label="Available Seats"
            value=""
            data={seatsData}
            onInputChange={inputChangeHandler}
          />
        </View>
        <View style={styles.right}>
          <DropdownCmp
            id="fareRange"
            label="Fare Range"
            value=""
            data={fareData}
            onInputChange={inputChangeHandler}
          />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={{paddingTop: 27, paddingLeft: 10}}>
          <Ionicons
            name={Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'}
            size={35}
          />
        </Text>
        <View style={styles.left}>
          <DropdownCmp
            id="day"
            label="Day"
            value=""
            data={dayData}
            onInputChange={inputChangeHandler}
          />
        </View>
        <View style={styles.right}>
          <DropdownCmp
            id="month"
            label="Month"
            value=""
            data={monthData}
            onInputChange={inputChangeHandler}
          />
        </View>
      </View>

      <Button title="Search" color={Colors.primary} onPress={submitHandler} />
    </View>
  );
};

SearchScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Serach',
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
  day: {
    width: 100,
    paddingLeft: 10,
  },
  month: {
    width: 150,
    paddingRight: 10,
  },
});

export default SearchScreen;

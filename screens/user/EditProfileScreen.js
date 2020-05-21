import React, {useState, useEffect, useReducer, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import * as accountActions from '../../store/actions/account';
import * as authActions from '../../store/actions/auth';
import ImgPicker from '../../components/UI/ImgPicker';
import {ScrollView} from 'react-native-gesture-handler';

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

const EditProfileScreen = (props) => {
  let identifier = props.navigation.getParam('identifier');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState();

  console.log(error, ' error, EditProfileScreen 52');
  const userAccount = useSelector((state) => state.account.userAccount);
  const userObject = userAccount[0];
  const userArray = userAccount;
  let user = userObject;
  if (userObject === undefined) {
    user = userArray;
  }

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: user ? user.firstName : '',
      lastName: user ? user.lastName : '',
      email: user ? user.email : '',
      profilePicture: user ? user.profilePicture : '',
    },
    inputValidities: {
      firstName: true,
      lastName: true,
      email: true,
      profilePicture: true,
    },
    formIsValid: true,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const imageTakenHandler = (imagePath) => {
    formState.inputValues.profilePicture = imagePath;
    setSelectedImage(imagePath);
  };

  const submitHandler = useCallback(async () => {
    let action;
    if (identifier === 'name') {
      action = accountActions.updateName(
        user['id'],
        formState.inputValues.firstName,
        formState.inputValues.lastName
      );
    } else if (identifier === 'email') {
      console.log('dispathing update email 99', formState.inputValues.email);
      action = authActions.updateEmail(user['id'], formState.inputValues.email);
    } else if (identifier === 'password') {
      action = authActions.updatePassword(
        user['id'],
        formState.inputValues.password
      );
    } else if (identifier === 'profilePicture') {
      action = accountActions.updateProfilePicture(
        user['id'],
        formState.inputValues.profilePicture
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      setIsLoading(false);
      props.navigation.navigate('Posts');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log('input changed', inputValue);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  let screen;
  if (identifier === 'name') {
    screen = (
      <View style={styles.form}>
        <Input
          id="firstName"
          label="First Name"
          keyboardType="default"
          required
          autoCapitalize="none"
          errorText="Please enter a valid name."
          onInputChange={inputChangeHandler}
          initialValue={user.firstName ? user.firstName : ''}
        />
        <Input
          id="lastName"
          label="last Name"
          keyboardType="default"
          required
          autoCapitalize="none"
          errorText="Please enter a valid name."
          onInputChange={inputChangeHandler}
          initialValue={user.lastName ? user.lastName : ''}
        />
      </View>
    );
  }

  if (identifier === 'email') {
    screen = (
      <View style={styles.form}>
        <Input
          id="email"
          label="Email"
          keyboardType="email-address"
          Email
          required
          autoCapitalize="none"
          errorText="Please enter a valid email."
          onInputChange={inputChangeHandler}
          initialValue={user.email ? user.email : ''}
        />
      </View>
    );
  }

  if (identifier === 'password') {
    screen = (
      <Input
        id="password"
        label="Password"
        keyboardType="default"
        secureTextEntry
        required
        autoCapitalize="none"
        errorText="Please enter a valid password."
        onInputChange={inputChangeHandler}
        initialValue={user.email ? user.email : ''}
      />
    );
  }

  if (identifier === 'profilePicture') {
    screen = <ImgPicker onImageTaken={imageTakenHandler} />;
  }
  return (
    <KeyboardAvoidingView keyboardVerticalOffset={50}>
      <ScrollView>
        {screen}
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Button
              title="Submit"
              color={Colors.accent}
              onPress={submitHandler}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProfileScreen.navigationOptions = (navData) => {
  let header = '';
  if (navData.navigation.getParam('identifier') === 'profilePicture') {
    header = 'Edit Profile Picture';
  } else if (navData.navigation.getParam('identifier') === 'name') {
    header = 'Edit User Name';
  } else if (navData.navigation.getParam('identifier') === 'email') {
    header = 'Edit Email';
  } else if (navData.navigation.getParam('identifier') === 'password') {
    header = 'Edit Password';
  }
  return {
    headerTitle: header,
  };
};

const styles = StyleSheet.create({});

export default EditProfileScreen;

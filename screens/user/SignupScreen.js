import React, {useState, useEffect, useReducer, useCallback} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useDispatch} from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import ImgPicker from '../../components/UI/ImgPicker';

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

const SignupScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    inputValidities: {
      email: false,
      password: false,
      firstName: false,
      lastName: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const authHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        authActions.signup(
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.firstName,
          formState.inputValues.lastName,
          selectedImage
        )
      );
      props.navigation.navigate('Posts');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  const imageTakenHandler = (imagePath) => {
    setSelectedImage(imagePath);
  };

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={50} style={styles.screen}>
      <LinearGradient colors={['#ffedff', '#ffe3ff']}>
        <ScrollView>
          <Input
            id="email"
            label="E-Mail"
            placeholder="Enter your email address"
            keyboardType="email-address"
            required
            email
            returnKeyType="next"
            autoCapitalize="none"
            errorText="Please enter a valid email address."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <Input
            id="password"
            label="Password"
            placeholder="Choose a secure password."
            keyboardType="default"
            secureTextEntry
            required
            returnKeyType="next"
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid password."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <View style={styles.nameContainer}>
            <View style={styles.name}>
              <Input
                id="firstName"
                label="First Name"
                placeholder="Enter your first name."
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                returnKeyType="next"
                required
                minLength={3}
                errorText="Please enter a valid name."
                onInputChange={inputChangeHandler}
                initialValue=""
            
              />
            </View>
            <View style={styles.name}>
              <Input
                id="lastName"
                label="Last Name"
                placeholder="Enter your last name."
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                required
                minLength={5}
                returnKeyType="next"
                errorText="Please enter a valid name."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
            </View>
          </View>
          <ImgPicker onImageTaken={imageTakenHandler} />
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Button
                title="Sign Up"
                color={Colors.primary}
                onPress={authHandler}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Switch to Login"
              color={Colors.accent}
              onPress={() => {
                props.navigation.navigate('Login');
              }}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

SignupScreen.navigationOptions = {
  headerTitle: 'Sign up',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {width: 160},
});

export default SignupScreen;

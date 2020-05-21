import React, {useState, useEffect, useReducer, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import * as accountActions from '../../store/actions/account';
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

const AddUserDetailsScreen = (props) => {
  console.log('I AddUserDetailScreen');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [error, setError] = useState();

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
      firstName: user.firstName ? true : false,
      lastName: user.lastName ? true : false,
      email: user.email ? true : false,
      profilePicture: user.profilePicture ? true : false,
    },
    formIsValid: user ? true : false,
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
    setError(null);
    setIsLoading(true);
    try {

      await dispatch(
        accountActions.updateAccount(
          user['id'],
          formState.inputValues.firstName,
          formState.inputValues.lastName,
          formState.inputValues.email,
          formState.inputValues.profilePicture
        )
      );
      setIsLoading(false);
      props.navigation.navigate('Posts');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

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

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={50}>
      <LinearGradient colors={['#ffedff', '#ffe3ff']}>
        <ScrollView>
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
            <ImgPicker onImageTaken={imageTakenHandler} />

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
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AddUserDetailsScreen.navigationOption = (navData) => {
  return {
    headerTitle: 'Add User Details',
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AddUserDetailsScreen;

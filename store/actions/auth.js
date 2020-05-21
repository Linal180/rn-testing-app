import {AsyncStorage} from 'react-native';

import * as accountActions from './account';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_EMAIL = 'UPDATE_EMAIL';

export const authenticate = (userId, token) => {
  return (dispatch) => {
    dispatch({type: AUTHENTICATE, userId: userId, token: token});
  };
};

export const signup = (
  email,
  password,
  firstName,
  lastName,
  profilePicture
) => {
  return async (dispatch) => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAY73gcwRjEedC9z3Fmhyz_B7JLDMExxRU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
      )
    );
    saveDataToStorage(resData.idToken, resData.localId);
    // props.navigation.navigate('UserDetails');
    //saveDataToDatabase(resData.idToken)
    await dispatch(
      accountActions.createAccount(
        resData.idToken,
        email,
        password,
        firstName,
        lastName,
        profilePicture
      )
    );
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAY73gcwRjEedC9z3Fmhyz_B7JLDMExxRU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken
      )
    );
    saveDataToStorage(resData.idToken, resData.localId);
  };
};

export const logout = () => {
  console.log('Logout')
  AsyncStorage.removeItem('userData');
  return {type: LOGOUT};
};


export const updateEmail = (id , email) =>{
  return async (dispatch, getState) => {
    console.log(id, email, 'auth action 124')
    const idToken = getState().auth.token;
    console.log(idToken);
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAY73gcwRjEedC9z3Fmhyz_B7JLDMExxRU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
          email: email,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email already exists!';
      } else if (errorId === 'INVALID_ID_TOKEN') {
        message = 'This tokenID agaist this email is invalid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    await dispatch(accountActions.updateEmail(id, email));
    saveDataToStorage(resData.idToken, resData.localId);
  };
}


const saveDataToStorage = (token, userId) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId
        })
  );
};

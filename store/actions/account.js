import * as authActions from './auth';
import Account from '../../models/account';

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const UPDATE_NAME = 'UPDATE_NAME';
export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PROFILE_PICTURE = 'UPDATE_PROFILE_PICTURE';
export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export const fetchAccounts = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/accounts.json`
      );

      if (!response.ok) {
        throw new Error('Something went wrong while fecthing all accounts!');
      }

      const resData = await response.json();
      const loadedAccounts = [];
      for (const key in resData) {
        loadedAccounts.push(
          new Account(
            key,
            resData[key].idToken,
            resData[key].userId,
            resData[key].email,
            resData[key].password,
            resData[key].firstName,
            resData[key].lastName,
            resData[key].profilePicture
          )
        );
      }
      dispatch({
        type: SET_ACCOUNTS,
        accounts: loadedAccounts,
        userAccount: loadedAccounts.filter(
          (account) => account.userId === userId
        ),
      });
    } catch (err) {
      throw err;
    }
  };
};

export const createAccount = (
  idToken,
  email,
  password,
  firstName,
  lastName,
  profilePicture
) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-testing-app.firebaseio.com/accounts.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
          email: email,
          firstName: firstName,
          lastName: lastName,
          profilePicture: profilePicture,
          userId: userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong while Creating new Account!');
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_ACCOUNT,
      accountData: {
        id: resData.name,
        idToken: idToken,
        email: email,
        firstName: firstName,
        lastName: lastName,
        profilePicture: profilePicture,
        userId: userId,
      },
    });
  };
};

export const updateAccount = (
  id,
  firstName,
  lastName,
  email,
  profilePicture
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/accounts/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            profilePicture: profilePicture,
            userId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong while Updating Account!');
      }

      const resData = await response.json();

      dispatch({
        type: UPDATE_ACCOUNT,
        accountData: {
          id: id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          profilePicture: profilePicture,
          userId: userId,
        },
      });
    } catch (error) {
      throw new Error('Something went wrong while updating Profile');
    }
  };
};

export const updateName = (id, firstName, lastName) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/accounts/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong while Updating User Name!');
      }

      const resData = await response.json();

      dispatch({
        type: UPDATE_NAME,
        accountData: {
          id: id,
          firstName: firstName,
          lastName: lastName,
        },
      });
    } catch (error) {
      throw new Error('Something went wrong while updating User Name');
    }
  };
};

export const updateEmail = (id, email) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      dispatch(authActions.updateEmail(id, email));
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/accounts/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong while Updating User Email!');
      }

      const resData = await response.json();

      dispatch({
        type: UPDATE_EMAIL,
        accountData: {
          id: id,
          email: email,
        },
      });
    } catch (error) {
      throw new Error('Something went wrong while updating User Email');
    }
  };
};

export const updatePassword = (id, password) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/accounts/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong while Updating User Password!');
      }

      const resData = await response.json();

      dispatch({
        type: UPDATE_PASSWORD,
        accountData: {
          id: id,
          password: password,
        },
      });
    } catch (error) {
      throw new Error('Something went wrong while updating User Password');
    }
  };
};

export const updateProfilePicture = (id, profilePicture) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/accounts/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profilePicture: profilePicture,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Something went wrong while Updating User Profile Picture!'
        );
      }

      const resData = await response.json();

      dispatch({
        type: UPDATE_PROFILE_PICTURE,
        accountData: {
          id: id,
          profilePicture: profilePicture,
        },
      });
    } catch (error) {
      throw new Error(
        'Something went wrong while updating User Profile Picture'
      );
    }
  };
};

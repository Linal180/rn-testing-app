import Account from '../../models/account';
import {
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
  SET_ACCOUNTS,
  UPDATE_NAME,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PROFILE_PICTURE,
} from '../actions/account';

const initialState = {
  accounts: [],
  userAccount: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNTS:
      return {
        accounts: action.accounts,
        userAccount: action.userAccount,
      };
    case CREATE_ACCOUNT:
      const newAccount = new Account(
        action.accountData.id,
        action.accountData.idToken,
        action.accountData.userId,
        action.accountData.email,
        action.accountData.password,
        action.accountData.firstName,
        action.accountData.lastName,
        action.accountData.profilePicture
      );
      return {
        accounts: state.accounts.concat(newAccount),
      };
    case UPDATE_ACCOUNT:
      const accountIndex = state.accounts.findIndex(
        (accnt) => accnt.id === action.accountData.id
      );
      const updatedAccnt = new Account(
        action.accountData.id,
        action.accountData.idToken,
        action.accountData.userId,
        action.accountData.email,
        action.accountData.password,
        action.accountData.firstName,
        action.accountData.lastName,
        action.accountData.profilePicture
      );
      const updatedAccounts = [...state.accounts];
      updatedAccounts[accountIndex] = updatedAccnt;

      return {
        ...state,
        accounts: updatedAccounts,
        userAccount: updatedAccnt,
      };
    case UPDATE_NAME:
      const accountIndex1 = state.accounts.findIndex(
        (accnt) => accnt.id === action.accountData.id
      );

      const accnt1 = state.accounts.find(
        (accnt) => accnt.id === action.accountData.id
      );
      const updatedAccnt1 = new Account(
        accnt1.id,
        accnt1.idToken,
        accnt1.userId,
        accnt1.email,
        accnt1.password,
        action.accountData.firstName,
        action.accountData.lastName,
        accnt1.profilePicture
      );
      const updatedAccounts1 = [...state.accounts];
      updatedAccounts1[accountIndex1] = updatedAccnt1;

      return {
        ...state,
        accounts: updatedAccounts1,
        userAccount: updatedAccnt1,
      };
    case UPDATE_EMAIL:
      const accountIndex2 = state.accounts.findIndex(
        (accnt) => accnt.id === action.accountData.id
      );

      const accnt2 = state.accounts.find(
        (accnt) => accnt.id === action.accountData.id
      );
      const updatedAccnt2 = new Account(
        accnt2.id,
        accnt2.idToken,
        accnt2.userId,
        action.accountData.email,
        accnt2.password,
        accnt2.firstName,
        accnt2.lastName,
        accnt2.profilePicture
      );
      const updatedAccounts2 = [...state.accounts];
      updatedAccounts2[accountIndex2] = updatedAccnt2;

      return {
        ...state,
        accounts: updatedAccounts2,
        userAccount: updatedAccnt2,
      };
    case UPDATE_PASSWORD:
      const accountIndex3 = state.accounts.findIndex(
        (accnt) => accnt.id === action.accountData.id
      );

      const accnt3 = state.accounts.find(
        (accnt) => accnt.id === action.accountData.id
      );
      const updatedAccnt3 = new Account(
        accnt3.id,
        accnt3.idToken,
        accnt3.userId,
        accnt3.email,
        action.accountData.password,
        accnt3.firstName,
        accnt3.lastName,
        accnt3.profilePicture
      );
      const updatedAccounts3 = [...state.accounts];
      updatedAccounts3[accountIndex3] = updatedAccnt3;

      return {
        ...state,
        accounts: updatedAccounts3,
        userAccount: updatedAccnt3,
      };
    case UPDATE_PROFILE_PICTURE:
      const accountIndex4 = state.accounts.findIndex(
        (accnt) => accnt.id === action.accountData.id
      );

      const accnt4 = state.accounts.find(
        (accnt) => accnt.id === action.accountData.id
      );
      const updatedAccnt4 = new Account(
        accnt4.id,
        accnt4.idToken,
        accnt4.userId,
        accnt4.email,
        accnt4.password,
        accnt4.firstName,
        accnt4.lastName,
        action.accountData.profilePicture
      );
      const updatedAccounts4 = [...state.accounts];
      updatedAccounts4[accountIndex4] = updatedAccnt4;

      return {
        ...state,
        accounts: updatedAccounts4,
        userAccount: updatedAccnt4,
      };
    default:
      return state;
  }
};

import {
  CURRENT_USER_AVAILABLE,
  CURRENT_USER_NOT_AVAILABLE,
  WEB3_AVAILABLE,
  USER_EXISTS,
  NEW_USER,
  NO_USER_EXISTS,
} from './authConstants';

export default function authReducer(
  state = { currentUserId: null, signInBox: false },
  action,
) {
  if (action.type === WEB3_AVAILABLE) {
    return { ...state, web3: action.payload };
  }

  if (action.type === CURRENT_USER_AVAILABLE) {
    return { ...state, currentUserId: action.payload };
  }

  if (action.type === CURRENT_USER_NOT_AVAILABLE) {
    return { ...state, currentUserId: 'PLEASE SIGN IN TO METAMASK' };
  }

  if (action.type === USER_EXISTS) {
    return {
      ...state,
      user: action.payload,
      newUser: false,
      existingUser: true,
      currentUserId: action.payload.walletId,
    };
  }

  if (action.type === NEW_USER) {
    return { ...state, newUser: true };
  }

  if (action.type === 'SHOW_SIGN_IN_BOX') {
    return { ...state, signInBox: true };
  }

  if (action.type === 'NOT_SIGNING_UP') {
    return { ...state, signInBox: false };
  }

  if (action.type === NO_USER_EXISTS) {
    return {
      ...state,
      existingUser: false,
      user: null,
      newUser: true,
      currentUserId: action.payload,
    };
  }

  return state;
}

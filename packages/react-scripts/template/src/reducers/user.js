
import { USER_SIGN_IN, USER_SIGN_OUT } from '../constants/user';

const initialState = {
  loggedIn: false 
}

export default (state = initialState, { type }) => {
  switch (type) {
    case USER_SIGN_IN:
      return {
        ...state,
        loggedIn: true
      }
    case USER_SIGN_OUT:
      return {
        ...state,
        loggedIn: false
      }
    default:
      return state;
  }
}


import { USER_SIGN_IN, USER_SIGN_OUT } from '../constants/user';

export const signIn = () => ({
  type: USER_SIGN_IN
});

export const signOut = () => ({
  type: USER_SIGN_OUT
});


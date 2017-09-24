import { createReducer } from 'redux-act';
import {
  failFetchingLoginState,
  fetchUser,
  failFetchingUser,
  login,
  logout,
  failFetchingApi,
  fetchHello
} from '../actions/auth';

const initial = {
  auth: {
    isPrepared: false,
    isLoggedIn: false,
    user: {
      project: ''
    },
    isFetching: false,
    error: undefined,
    jwt: '',
    hello: null,
    pathname: null
  }
};

const authReducer = createReducer(
  {
    [failFetchingLoginState]: (state, payload) =>
      Object.assign({}, initial, {
        isPrepared: true,
        pathname: payload.pathname
      }),
    [fetchUser]: state =>
      Object.assign({}, state, {
        isFetching: true,
        error: undefined
      }),
    [failFetchingUser]: (state, err) =>
      Object.assign({}, state, {
        isFetching: false,
        error: err
      }),
    [login]: (state, payload) => {
      return Object.assign({}, state, {
        isPrepared: true,
        isLoggedIn: true,
        user: payload.user || state.user,
        isFetching: false,
        error: undefined,
        jwt: payload.jwt,
        pathname: payload.pathname
      });
    },
    [logout]: () =>
      Object.assign({}, initial.auth, {
        isPrepared: true
      }),
    [failFetchingApi]: (state, err) => {
      return Object.assign({}, state, {
        error: err
      });
    },
    [fetchHello]: (state, payload) => {
      return Object.assign({}, state, {
        hello: payload
      });
    }
  },
  initial.auth
);

export default authReducer;

import { take, call, put } from 'redux-saga/effects';
import * as AWSCognito from 'amazon-cognito-identity-js';
import {
  fetchLoginState,
  failFetchingLoginState,
  fetchUser,
  failFetchingUser,
  login,
  clickLogout,
  logout,
  hello,
  fetchHello,
  failFetchingApi
} from '../actions/auth';
import superFetch from '../modules/superFetch';

const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID
};

const userPool = new AWSCognito.CognitoUserPool(poolData);

function endpoint(s) {
  return `${process.env.REACT_APP_ENDPOINT}/${s}`;
}

const getSession = cognitoUser =>
  new Promise((resolve, reject) => {
    cognitoUser.getSession((err, result) => {
      if (result) {
        cognitoUser.getUserAttributes((err, attrs) => {
          if (err) {
            resolve({ payload: null, err });
          } else {
            const payload = {};
            payload.user = {};
            attrs.forEach(attr => (payload.user[attr.Name] = attr.Value));
            payload.jwt = result.getIdToken().getJwtToken();
            resolve({ payload });
          }
        });
      } else {
        resolve({ payload: null, err });
      }
    });
  });

const cognitoSignIn = params =>
  new Promise((resolve, reject) => {
    const { email, password } = params;
    const authenticationDetails = new AWSCognito.AuthenticationDetails({
      Username: email,
      Password: password
    });

    const cognitoUser = new AWSCognito.CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        cognitoUser.getUserAttributes((err, attrs) => {
          const payload = {};
          attrs.forEach(attr => (payload[attr.Name] = attr.Value));
          payload.jwt = result.getIdToken().getJwtToken();
          resolve({ payload });
        });
      },
      onFailure: err => {
        resolve({ payload: null, err });
      }
    });
  });

const getAccessToken = cognitoUser =>
  new Promise((resolve, reject) => {
    cognitoUser.getSession((err, result) => {
      if (result) {
        const token = result.getAccessToken().getJwtToken();
        resolve({ token });
      } else {
        resolve({ token: null, err });
      }
    });
  });

const globalSignOut = cognitoUser =>
  new Promise((resolve, reject) => {
    cognitoUser.globalSignOut({
      onSuccess: result => {
        resolve({ result });
      },
      onFailure: err => {
        resolve({ result: null, err });
      }
    });
  });

export function* handleFetchLoginState() {
  while (true) {
    const action = yield take(`${fetchLoginState}`);

    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      const { payload, err } = yield call(getSession, cognitoUser);

      if (payload && !err) {
        yield put(login(Object.assign({}, payload, action.payload)));
        continue;
      }
      yield put(failFetchingLoginState(action.payload));
      continue;
    }
    yield put(failFetchingLoginState(''));
  }
}

export function* handleLogout() {
  while (true) {
    yield take(`${clickLogout}`);

    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      const { token, err } = yield call(getAccessToken, cognitoUser);

      if (token && !err) {
        const { result, err } = yield call(globalSignOut, cognitoUser);
        if (result && !err) {
          yield put(logout());
        }
      }
    }
  }
}

export function* handleLogin() {
  while (true) {
    const action = yield take(`${fetchUser}`);
    const { email, password } = action.payload;

    if (email && password) {
      const { payload, err } = yield call(cognitoSignIn, action.payload);

      if (!payload && err) {
        yield put(failFetchingUser(`${err.statusCode}: ${err.message}`));
        continue;
      }

      yield put(login(payload));
      continue;
    }
    yield put(failFetchingUser('Please set email and password'));
  }
}

export function* handleApi() {
  while (true) {
    const action = yield take(`${hello}`);

    const { payload, err } = yield call(superFetch, {
      url: endpoint(action.payload.path),
      type: 'POST',
      custom: {
        mode: 'cors',
        headers: {
          Authorization: `${action.payload.jwt}`
        }
      }
    });

    if (payload && !err) {
      yield put(fetchHello(payload));
      continue;
    }
    yield put(failFetchingApi(err));
  }
}

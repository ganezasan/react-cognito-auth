import { fork } from 'redux-saga/effects';
import * as auth from './auth';

export default function* rootSaga() {
  yield fork(auth.handleFetchLoginState);
  yield fork(auth.handleLogin);
  yield fork(auth.handleLogout);
  yield fork(auth.handleApi);
}

import { createAction } from 'redux-act';

export const fetchLoginState = createAction('fetch login state');
export const failFetchingLoginState = createAction('fail fetching login state');

export const fetchUser = createAction('fetch user');
export const failFetchingUser = createAction('fail fetching user');

export const login = createAction('login');
export const clickLogout = createAction('click logout');
export const logout = createAction('logout');

export const failFetchingApi = createAction('fail fetching api');

export const hello = createAction('hello');

export const fetchHello = createAction('fetch hello');

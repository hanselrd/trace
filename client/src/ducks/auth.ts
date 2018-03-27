import { createAction, createReducer, Action } from 'redux-act';
import { all, call, put, takeLatest } from 'redux-saga/effects';

const authTokenKey = 'trace:auth';

export const authActions = {
  start: createAction('@@auth/START'),
  login: createAction<string>('@@auth/LOGIN'),
  logout: createAction('@@auth/LOGOUT')
};

export const authServices = {
  getAuthToken: () => localStorage.getItem(authTokenKey),
  setAuthToken: (auth: string) => localStorage.setItem(authTokenKey, auth),
  unsetAuthToken: () => localStorage.removeItem(authTokenKey)
};

export const authSagas = {
  start: function*(action: Action<null>) {
    const authToken = yield call(authServices.getAuthToken);
    if (authToken) {
      yield put(authActions.login(authToken));
    }
  },
  login: function*(action: Action<string>) {
    yield all([call(authServices.setAuthToken, action.payload)]);
  },
  logout: function*(action: Action<null>) {
    yield all([call(authServices.unsetAuthToken)]);
  }
};

export const authSaga = function*() {
  yield all([
    takeLatest(authActions.start.getType(), authSagas.start),
    takeLatest(authActions.login.getType(), authSagas.login),
    takeLatest(authActions.logout.getType(), authSagas.logout)
  ]);
};

export type AuthState = Readonly<{
  auth?: string;
}>;

const reducer = createReducer<AuthState>({}, {});

reducer.on(authActions.login, (state, payload) => ({
  ...state,
  auth: payload
}));

reducer.on(authActions.logout, state => ({
  ...state,
  auth: undefined
}));

export default reducer;
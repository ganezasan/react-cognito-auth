import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './rootReducer';
import rootSaga from './auth/sagas';

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
      sagaMiddleware
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
}

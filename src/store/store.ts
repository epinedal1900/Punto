import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
// import { createLogger } from 'redux-logger';

// const loggerMiddleware = createLogger();

const configureStore = (preloadedState = {}) => {
  const middlewares = [thunkMiddleware]; // loggerMiddleware
  const middlewareEnhancer = composeWithDevTools(
    applyMiddleware(...middlewares)
  );

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);
  // @ts-expect-error: error
  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
};
const store = configureStore();
export default store;

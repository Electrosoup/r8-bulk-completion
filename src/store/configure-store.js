import rootReducer from '../reducers'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

/* istanbul ignore next */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (initialState) => 
  createStore(
    rootReducer,
    initialState /* preloadedState, */,
    composeEnhancers(
    applyMiddleware(thunk),
  ))


import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import plazaReducer from './plazaReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  plaza: plazaReducer,
});

export default rootReducer;

import { combineReducers } from 'redux';

// import reducers
import { authReducer } from './authReducer';
import { errorReducer } from './errorReducer';
import { balanceReducer } from './balanceReducer';

const reducers = combineReducers({
  auth: authReducer,
  error: errorReducer,
  balance: balanceReducer,
});

export default reducers;
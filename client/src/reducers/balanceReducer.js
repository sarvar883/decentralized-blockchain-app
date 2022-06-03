import {
  LOADING_ALL_BALANCES,
  GET_ALL_BALANCES,
} from '../actions/types';


const initialState = {
  all_balances: {},
  loading: false,
};


export const balanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_ALL_BALANCES:
      return {
        ...state,
        loading: true,
      };

    case GET_ALL_BALANCES:
      return {
        ...state,
        all_balances: action.payload,
        loading: false,
      };

    default: return state;
  }
}
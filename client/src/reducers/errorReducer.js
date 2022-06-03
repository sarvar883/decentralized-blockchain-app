import {
  SET_ERROR,
} from '../actions/types';

const initialState = {};

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...action.payload
      };

    default: return state;
  }
}
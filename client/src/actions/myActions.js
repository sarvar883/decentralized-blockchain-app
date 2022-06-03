import axios from 'axios';

import {
  SET_ERROR,
  LOADING_ALL_BALANCES,
  GET_ALL_BALANCES,
} from './types';


export const broadcastMessage = (message) => async (dispatch) => {
  const object = { message };

  try {
    const { data } = await axios.post('/client/test', { object });
    console.log('data', data);
  } catch (error) {
    console.log('broadcastMessage ERROR: ', error);
    dispatch({
      type: SET_ERROR,
      payload: error,
    });
  }
};


export const getBalanceOfAllUsers = () => async (dispatch) => {
  dispatch({ type: LOADING_ALL_BALANCES, });

  try {
    const { data } = await axios.post('/client/get-balance-all-users');
    // console.log('data', data);
    dispatch({ type: GET_ALL_BALANCES, payload: data.balance });

  } catch (error) {
    console.log('getBalanceOfAllUsers ERROR: ', error);
    dispatch({
      type: SET_ERROR,
      payload: error,
    });
  }
};


export const checkMyBalance = () => async (dispatch) => {
  try {
    const { data } = await axios.post('/client/check-balance');
    console.log('data', data);
  } catch (error) {
    console.log('checkMyBalance ERROR: ', error);
    dispatch({
      type: SET_ERROR,
      payload: error,
    });
  }
};


export const createTransaction = (object) => async (dispatch) => {
  try {
    const { data } = await axios.post('/client/create-transaction', { object });
  } catch (error) {
    console.log('createTransaction ERROR: ', error);
    dispatch({
      type: SET_ERROR,
      payload: error,
    });
  }
};
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useActions } from '../utils/useActions';
import user from '../utils/user';


const StartPage = () => {
  const [my_balance, setMyBalances] = useState(0);
  const [other_balances, setOtherBalances] = useState({});

  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState(0);
  const balanceReducer = useSelector((state) => state.balance);

  const { getBalanceOfAllUsers, createTransaction } = useActions();

  useEffect(() => {
    getBalanceOfAllUsers();
  }, []);

  useEffect(() => {
    const allBalances = { ...balanceReducer.all_balances };

    setMyBalances(allBalances[user.name]);

    delete allBalances[user.name];

    setOtherBalances(allBalances);
  }, [balanceReducer]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (Number(amount) > my_balance) {
      return alert('У вас недостаточно монет');
    }

    const object = {
      receiverName: receiver,
      amount: Number(amount),
    };
    // console.log('onSubmit', object);
    createTransaction(object);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 mt-2">
          <h2 className="text-center">Welcome!</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <h4 className='m-2'>Your balance: {my_balance}</h4>
              </div>
            </div>

            <div className="col-12 mt-3">
              <div className="card">
                <h3 className="text-center">Balance of other users</h3>

                {Object.keys(other_balances).map((key, index) => (
                  <Fragment key={index}>
                    <span>
                      <h6 className='d-inline'>User {index + 1} ({key})</h6>
                      <h4>Balance: {other_balances[key]}</h4>
                    </span>

                    <button
                      className="btn btn-dark btn-sm mb-3"
                      onClick={() => setReceiver(key)}
                    >
                      Paste to transaction
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>


        <div className="col-md-6">
          <div className="card p-3">
            <h3 className="text-center">Create transaction</h3>
            <form onSubmit={onSubmit}>
              <div className="form-group mt-2">
                <label htmlFor="receiver">Receiver</label>
                <input
                  type="text"
                  className="form-control"
                  name="receiver"
                  placeholder="Public key of receiver"
                  onChange={(e) => setReceiver(e.target.value)}
                  value={receiver}
                  required
                />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  placeholder="How many coins to send"
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success mt-2">Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartPage;
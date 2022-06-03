const asyncHandler = require('express-async-handler');
const {
  // getTemporaryTransactions,
  addToTemporaryTransactions,
  clearTemporaryTransactions,
  addNewBlock,
  readCache,
  setCacheItem,
} = require('../db');
const {
  broadcastCreateTransaction,
  broadcastNewBlock,
} = require('../utils/broadCast');
const {
  delay,
  calculateHashFromObject,
  getLastBlockHash,
  checkIfHashIsValid,
  verifyTransaction,
  convertStringToBuffer,
  verifyPreviousTransactionHash,
  checkIfBlockAlreadyExists,
  mineNewBlock,
} = require('../utils/functions');

const UTILS = require('../utils/utils');


exports.test = asyncHandler(async (req, res, next) => {
  console.log('test');
});


exports.receiveTransaction = asyncHandler(async (req, res, next) => {
  const transaction = req.body.transaction;

  console.log('received transaction, sending response');
  res.json({ success: true, });

  const helper_object = {
    id: transaction.id,
    sender: transaction.sender,
    receiver: transaction.receiver,
    amount: transaction.amount,
  };

  try {
    // calculate transaction hash
    const transaction_hash = await calculateHashFromObject(helper_object);

    // console.log('transaction', transaction);

    // check if transaction is valid
    const { isTransactionReal } = verifyTransaction({
      hash: transaction_hash,
      senderPublicKey: transaction.sender,
      signature: convertStringToBuffer(transaction.signature),
    });

    // console.log('isTransactionReal:', isTransactionReal);

    if (!isTransactionReal) {
      return;
    }

    let { previousTransactionHash } = transaction;

    // console.log('previousTransactionHash:', previousTransactionHash);

    // chech previous transaction hash
    let verifyObject = await verifyPreviousTransactionHash({
      previousTransactionHash, amount: transaction.amount,
    });

    // console.log('verifyObject', verifyObject);

    if (!verifyObject.isPreviousTransactionHashCorrect) {
      console.log('receiveTransaction previousTransactionHash is not correct');
      return;
    }

    // update cache
    await setCacheItem({
      hash: previousTransactionHash,
      amount: verifyObject.transactionAmount - transaction.amount,
    });

    console.log('receiveTransaction', transaction);

    const response = await addToTemporaryTransactions(transaction);

    // all temporary transactions
    const allTransactions = response.transactions;

    let newBlock;

    if (allTransactions.length === UTILS.TRANSACTIONS_IN_BLOCK) {
      newBlock = await mineNewBlock(allTransactions);

      console.log(`Node ${UTILS.NODE_NUMBER} mined new block, with nons ${newBlock.nons}`);

      await addNewBlock(newBlock);

      await clearTemporaryTransactions();

      await broadcastNewBlock(newBlock);
    }

  } catch (error) {
    console.log('receiveTransaction ERROR:', error);
  }
});


exports.receiveNewBlock = asyncHandler(async (req, res, next) => {
  // node received from another node new block
  // the new block should be verified
  const newBlock = req.body.block;

  console.log('received new block, sending response');
  res.json({ success: true, });

  // console.log('receiveNewBlock newBlock with nons', newBlock.nons);

  try {
    const previous_block_hash = await getLastBlockHash();

    // calculate hash from array of transactions
    const transactions_hash = await calculateHashFromObject(newBlock.transactions);

    // validate transactions_hash
    const block_headers = {
      previous_block_hash: previous_block_hash,
      transactions_hash: transactions_hash,
      nons: newBlock.nons,
    };

    // console.log('receiveNewBlock blockHeaders', block_headers);

    const blockHash = await calculateHashFromObject(block_headers);

    // console.log('receiveNewBlock blockHash', blockHash);

    if (!checkIfHashIsValid(blockHash)) {
      console.log('BlockHash is not valid');

      return res.json({ success: false, message: 'BlockHash is not valid' });
    }


    // verifying transactions (verifyPreviousTransactionHash)
    for (let i = 0; i < newBlock.transactions.length; i++) {
      let currentTransaction = newBlock.transactions[i];

      // check previousTransactionHash
      let verifyObject = await verifyPreviousTransactionHash({
        previousTransactionHash: currentTransaction.previousTransactionHash,
        amount: currentTransaction.amount,
      });

      // console.log('verifyObject', verifyObject);

      if (!verifyObject.isPreviousTransactionHashCorrect) {
        console.log('receiveNewBlock previousTransactionHash is not correct');
        return;
      }
    }

    let blockExists = await checkIfBlockAlreadyExists(transactions_hash);

    if (blockExists) {
      console.log('receiveNewBlock: blockExists');
      return;
    }

    await addNewBlock(newBlock);

    await clearTemporaryTransactions();

  } catch (error) {
    console.log('receiveNewBlock ERROR:', error);
  }
});
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const UTILS = require('../utils/utils');

const {
  readDatabase,
  getBalanceOfUser,
  // getTemporaryTransactions,
  addToTemporaryTransactions,
  clearTemporaryTransactions,
  addNewBlock,
  // getLastBlock,
} = require('../db');
const {
  broadcastCreateTransaction,
  broadcastNewBlock,
} = require('../utils/broadCast');
const {
  delay,
  calculateHashFromObject,
  getLastBlockHash,
  convertBufferToString,
  convertStringToBuffer,
  checkIfHashIsValid,
  getPublicKeyFromName,
  verifyTransaction,
  getPreviousTransactionHash,
  mineNewBlock,
  checkIfBlockAlreadyExists,
} = require('../utils/functions');


exports.test = asyncHandler(async (req, res, next) => {
  const data = await readDatabase();

  // console.log('data', data);

  data.forEach(object => console.log(object));

  res.json({ success: true, });
});


exports.balanceAllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = [{ ...UTILS.CURRENT_USER }, ...UTILS.ALL_USERS];

  const balance = {};

  for (let i = 0; i < allUsers.length; i++) {
    let user = allUsers[i];

    let currentBalance = await getBalanceOfUser(user.publicKey);

    balance[user.name] = currentBalance;
  }

  return res.json({ success: true, balance, });
});


exports.createTransaction = asyncHandler(async (req, res, next) => {
  res.json({ success: true, });

  // req.body.object has structure
  // {
  //   receiverName: string;
  //   amount: number;
  // }
  const transaction = {
    // id of transaction -- random string 
    id: uuidv4(),
    // public key of sender
    sender: UTILS.CURRENT_USER.publicKey,
    // public key of receiver
    receiver: getPublicKeyFromName(req.body.object.receiverName),
    // amount
    amount: req.body.object.amount,
  };

  // calculate transaction hash 
  const transactionHash = await calculateHashFromObject(transaction);
  // console.log('transactionHash', transactionHash);

  // sign this hash with sender's private key
  const signature = crypto.sign('sha256', Buffer.from(transactionHash), {
    key: UTILS.CURRENT_USER.privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });

  // transaction hash and signature
  transaction.hash = transactionHash;
  transaction.signature = convertBufferToString(signature);

  const previousHashObject = await getPreviousTransactionHash({ amount: transaction.amount });

  if (!previousHashObject.success) {
    console.log('Unable to get previousTransactionHash');
    return;
  }

  transaction.previousTransactionHash = previousHashObject.previousTransactionHash;

  const response = await addToTemporaryTransactions(transaction);

  const allTransactions = response.transactions;

  try {
    await broadcastCreateTransaction(transaction);

    console.log('broadcastCreateTransaction');

    // all nodes have 3 transactions and they start generating a new block
    // they all try to find nons
    // if node finds nons, it broadcasts nons to all other nodes 
    // new block is added to database.json

    let newBlock;

    if (allTransactions.length === UTILS.TRANSACTIONS_IN_BLOCK) {
      console.log('enough TRANSACTIONS_IN_BLOCK');

      newBlock = await mineNewBlock(allTransactions);

      console.log(`Node ${UTILS.NODE_NUMBER} mined new block, with nons ${newBlock.nons}`);
      // console.log('newBlock object', newBlock);

      // chech if block with these transactions is in blockchain (database.json)
      let blockExists = await checkIfBlockAlreadyExists(newBlock.transactions_hash);

      if (blockExists) {
        console.log('createTransaction: blockExists');
        return;
      }

      await addNewBlock(newBlock);

      await clearTemporaryTransactions();

      await broadcastNewBlock(newBlock);
    }

  } catch (error) {
    console.log('createTransaction ERROR:', error);
  }
});
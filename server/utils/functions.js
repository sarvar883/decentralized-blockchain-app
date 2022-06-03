const crypto = require('crypto');
const hashFunction = require('object-hash');
const {
  getLastBlock,
  readDatabase,
  readCache,
  setCacheItem,
} = require('../db');
const UTILS = require('./utils');


exports.delay = (ms) => new Promise(res => setTimeout(res, ms));


exports.calculateHashFromObject = async (object) => {
  return await hashFunction(object);
};



const getLastBlockHash = async () => {
  const block = await getLastBlock();

  const object = {
    previous_block_hash: block.previous_block_hash,
    transactions_hash: block.transactions_hash,
    nons: block.nons,
  };

  return await hashFunction(object);
};

exports.getLastBlockHash = getLastBlockHash;

// hash is valid if it starts with 00
// hash is string
const checkIfHashIsValid = (hash = '') => {
  return hash.slice(0, 2) === '00';
};

exports.checkIfHashIsValid = checkIfHashIsValid;


exports.convertBufferToString = (buffer) => {
  return buffer.toString('base64');
};


exports.convertStringToBuffer = (string) => {
  return Buffer.from(string, 'base64');
};


// get public key of user with this name
exports.getPublicKeyFromName = (name) => {
  let publicKey = '';

  for (let i = 0; i < UTILS.ALL_USERS.length; i++) {
    let currentUser = UTILS.ALL_USERS[i];

    if (currentUser.name === name) {
      publicKey = currentUser.publicKey;
    }
  }

  return publicKey;
};


// verify transaction
exports.verifyTransaction = (object = {}) => {
  const {
    // transaction hash
    hash,
    // transaction signature
    signature,
    senderPublicKey,
  } = object;

  const isVerified = crypto.verify('sha256', Buffer.from(hash),
    {
      key: senderPublicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    signature
  );

  return { isTransactionReal: isVerified };
};


// amount of transaction
exports.getPreviousTransactionHash = async ({ amount }) => {
  const database = await readDatabase();
  // public key of this user
  const thisPublicKey = UTILS.CURRENT_USER.publicKey;

  let success = true;
  let previousTransactionHash = '';

  exit_loops:
  for (let i = 0; i < database.length; i++) {
    let block = database[i];

    for (let j = 0; j < block.transactions.length; j++) {
      let transaction = block.transactions[j];

      if (transaction.receiver !== thisPublicKey) {
        continue;
      }

      // console.log('getPreviousTransactionHash transaction', transaction);

      let hash = transaction.hash;

      // if there is item with this hash in cache.json
      let cacheObject = await readCache();

      if (!cacheObject.hasOwnProperty(hash) && transaction.amount >= amount) {
        previousTransactionHash = hash;
        success = true;

        await setCacheItem({
          hash,
          amount: transaction.amount - amount,
        });

        break exit_loops;
      }

      // not enough coins in this transaction
      if (cacheObject.hasOwnProperty(hash) && cacheObject[hash] < amount) {
        success = false;
      } else {
        // transaction has enough coins
        previousTransactionHash = hash;
        success = true;

        await setCacheItem({ hash, amount: cacheObject[hash] - amount });
        break exit_loops;
      }
    }
  }

  return { success, previousTransactionHash };
};


exports.verifyPreviousTransactionHash = async ({ previousTransactionHash, amount }) => {
  let isPreviousTransactionHashCorrect = false;
  let isInCache = false;

  const cache = await readCache();

  if (cache[previousTransactionHash]) {
    isInCache = true;
    console.log('cache.hasOwnProperty');

    // transaction hash is in cache and does not have enough coins
    if (cache[previousTransactionHash] < amount) {
      return {
        isPreviousTransactionHashCorrect: false,
        isInCache,
        transactionAmount: -1,
      };
    }

    // transaction hash is in cache and has enough coins
    if (cache[previousTransactionHash] >= amount) {
      return {
        isPreviousTransactionHashCorrect: true,
        isInCache,
        transactionAmount: cache[previousTransactionHash],
      };
    }

  }

  // ============================================
  console.log('transaction hash is not found in cache');

  // search in database.json transaction with that hash and return its amount
  let transactionAmount = -1;

  const database = await readDatabase();

  exit_loops:
  for (let i = 0; i < database.length; i++) {
    let block = database[i];

    for (let j = 0; j < block.transactions.length; j++) {
      let transaction = block.transactions[j];

      if (transaction.hash !== previousTransactionHash) {
        continue;
      }

      // transaction with that hash is found
      console.log('transaction', transaction);

      if (transaction.amount < amount) {
        isPreviousTransactionHashCorrect = false;
        break exit_loops;
      }

      if (transaction.amount >= amount) {
        transactionAmount = transaction.amount;

        isPreviousTransactionHashCorrect = true;

        break exit_loops;
      }
    }
  }

  return { isPreviousTransactionHashCorrect, isInCache, transactionAmount };
};


exports.mineNewBlock = async (transactions) => {
  console.log(`Node ${UTILS.NODE_NUMBER} is mining...`);

  try {
    // calculate hash of transaction
    const transactions_hash = await hashFunction(transactions);

    const last_block_hash = await getLastBlockHash();

    const block_headers = {
      previous_block_hash: last_block_hash,
      transactions_hash,
      nons: 0,
    };


    let blockHash = '';
    // console.log('before while loop');
    while (true) {
      blockHash = await hashFunction(block_headers);

      if (checkIfHashIsValid(blockHash)) {
        console.log('mineNewBlock blockHash:', blockHash);
        break;
      }

      block_headers.nons++;
    }

    // create new transaction object
    const newBlock = {
      ...block_headers,
      transactions: transactions,
    };

    // console.log('newBlock object', newBlock);

    return newBlock;

  } catch (error) {
    console.log('mineNewBlock ERROR:', error);
    return {};
  }
};


exports.checkIfBlockAlreadyExists = async (hash) => {
  // hash - transactions_hash
  const blockChain = await readDatabase();

  let exists = false;

  for (let i = 0; i < blockChain.length; i++) {
    let block = blockChain[i];

    let transactions_hash = await exports.calculateHashFromObject(block.transactions);

    if (transactions_hash === hash) {
      exists = true;
      break;
    }
  }

  console.log('checkIfBlockAlreadyExists', exists);

  return exists;
};
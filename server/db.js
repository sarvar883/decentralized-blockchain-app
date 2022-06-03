const fs = require('fs-extra');

// path to database.json and temporary_transactions.json files
const pathToDatabase = './server/database.json';
const pathToTemporaryTransactions = './server/temporary_transactions.json';
const pathToCache = './server/cache.json';


exports.readDatabase = async () => {
  return await fs.readJSON(pathToDatabase);
};


// check balance of the user with this public key
exports.getBalanceOfUser = async (publicKey) => {
  const blockChain = await fs.readJSON(pathToDatabase);

  let balance = 0;

  for (let i = 0; i < blockChain.length; i++) {
    let block = blockChain[i];

    for (let j = 0; j < block.transactions.length; j++) {
      let transaction = block.transactions[j];

      if (transaction.receiver === publicKey) {
        balance += transaction.amount;
      }

      if (transaction.sender === publicKey) {
        balance -= transaction.amount;
      }
    }
  }

  return balance;
};


exports.addNewBlock = async (block) => {
  const data = await fs.readJSON(pathToDatabase);

  console.log('addNewBlock');

  const blocks = [...data, block];

  await fs.writeJson(pathToDatabase, blocks);

  // return all blocks
  return { success: true, blocks };
};


exports.getLastBlock = async () => {
  const allBlocks = await fs.readJSON(pathToDatabase);

  const lastBlock = allBlocks[allBlocks.length - 1];

  return lastBlock;
};


exports.getTemporaryTransactions = async () => {
  return await fs.readJSON(pathToTemporaryTransactions);
};

exports.addToTemporaryTransactions = async (transaction) => {
  const data = await fs.readJSON(pathToTemporaryTransactions);

  const newArray = [...data, transaction];

  // console.log('addToTemporaryTransactions', newArray);

  await fs.writeJson(pathToTemporaryTransactions, newArray);

  // return all transactions
  return { success: true, transactions: newArray };
};


exports.clearTemporaryTransactions = async () => {
  return await fs.writeJson(pathToTemporaryTransactions, []);
};


exports.readCache = async () => {
  return await fs.readJSON(pathToCache);
};


// update item in cache
exports.setCacheItem = async ({ hash, amount }) => {
  const cache = await fs.readJSON(pathToCache);

  cache[hash] = amount;

  await fs.writeJson(pathToCache, cache);

  // return success message and new cache
  return { success: true, newCache: cache };
};
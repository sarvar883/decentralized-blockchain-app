const axios = require('axios');
const UTILS = require('./utils');


exports.broadcastCreateTransaction = async (data) => {
  for (let i = 0; i < UTILS.ALL_USERS.length; i++) {
    let currentUrl = UTILS.ALL_USERS[i].url;

    await axios.post(`${currentUrl}/node/create-transaction`, { transaction: data });
  }

  return { success: true, };
};


exports.broadcastNewBlock = async (block) => {
  for (let i = 0; i < UTILS.ALL_USERS.length; i++) {
    let currentUrl = UTILS.ALL_USERS[i].url;

    await axios.post(`${currentUrl}/node/new-block`, { block });
  }

  return { success: true, };
};
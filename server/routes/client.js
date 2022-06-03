const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client');

// incoming requests from the Web client-side
router.post('/test', clientController.test);
router.post('/get-balance-all-users', clientController.balanceAllUsers);
router.post('/create-transaction', clientController.createTransaction);

module.exports = router;
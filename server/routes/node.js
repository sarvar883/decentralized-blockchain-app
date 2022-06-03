const express = require('express');
const router = express.Router();

const nodeController = require('../controllers/node');

// incoming requests from the other nodes
router.post('/test', nodeController.test);
router.post('/create-transaction', nodeController.receiveTransaction);
router.post('/new-block', nodeController.receiveNewBlock);

module.exports = router;
const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middlewares/authenticate');
const { sendFriendRequest, friendRequestUpdate, friendsList, getFriendRequestList } = require('../controllers/friend.controller');

router.post('/friends', authenticate, sendFriendRequest);
router.get('/friends', authenticate, friendsList);
router.get('/friends-request', authenticate, getFriendRequestList);
router.put('/friends-request/:id', authenticate, friendRequestUpdate);

module.exports = router;
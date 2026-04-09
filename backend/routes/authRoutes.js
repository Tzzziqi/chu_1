const express = require('express');
const router = express.Router();
const { signup, signin, updatePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

//public
router.post('/signup', signup);
router.post('/signin', signin);

//pretected by router, teh authMiddleware is the guard
router.put('/password', authMiddleware, updatePassword);

module.exports = router;
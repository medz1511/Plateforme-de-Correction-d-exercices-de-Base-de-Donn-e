const express = require('express');
const { register, login, logout, getCurrentUser} = require('./controller');
const { validateRegister, validateLogin } = require('./validation');
const {verifyToken} = require("../../middleware/auth");

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get("/logout", logout);
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;

const express = require("express");
const router = express.Router();

const authenticate = require('../middleware/auth');

const { register, login, logout } = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout)

module.exports = router;
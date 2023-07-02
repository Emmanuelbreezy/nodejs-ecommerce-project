const express = require('express');
const router = express.Router();
const AuthController = require("../controller/auth.controller.js");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js');


const authController = new AuthController();
router.post('/register', authController.createUser);
router.post('/login', authController.login);
router.put('/:id', authController.updateUser);
router.delete('/:id', authController.deleteUser);
router.get('/:id', authMiddleware, isAdmin, authController.getSingleUser);
router.get('/', authController.getAllUsers);


module.exports = router;
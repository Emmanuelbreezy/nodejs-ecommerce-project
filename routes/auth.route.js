// routes/auth.route.js

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creating a new user
 *     tags: [Authentication]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 * 
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *              schema:
 *               type: object
 *       '400':
 *         description: Registration failed
 *              
 *                 
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in and obtain access token
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: User logged in successfully
 */

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: forgot password and get reset password link in email
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Reset link sent to mail successfully
 */

const express = require('express');
const router = express.Router();
const AuthController = require("../controller/auth.controller.js");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js');


const authController = new AuthController();
router.post('/register', authController.createUser);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassToken);
router.put('/reset-password/:token', authController.resetPassword);
router.put('/change-password', authMiddleware, authController.updatePassword);
router.put('/:id', authController.updateUser);
router.put('/block-user/:id', authMiddleware,isAdmin, authController.blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, authController.unblockUser);
router.delete('/:id', authController.deleteUser);
router.get('/refresh', authController.handleRefreshToken);
router.get('/logout', authController.logout);
router.get('/:id', authMiddleware, isAdmin, authController.getSingleUser);
router.get('/', authController.getAllUsers);


module.exports = router;
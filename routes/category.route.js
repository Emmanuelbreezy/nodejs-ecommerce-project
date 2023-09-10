// routes/category.route.js

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category endpoints
 */

const express = require('express');
const router = express.Router();
const CategoryController = require("../controller/category.controller.js");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js');


const categoryController = new CategoryController();
router.post('/create', authMiddleware,isAdmin,categoryController.createCategory);
router.put('/:id', authMiddleware,isAdmin, categoryController.updateCategory);
router.delete('/:id',authMiddleware,isAdmin, categoryController.deleteCategory);
router.get('/:id', categoryController.getCategory);
router.get('/', categoryController.getAllCategory);


module.exports = router;

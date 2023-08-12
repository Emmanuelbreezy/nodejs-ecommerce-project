// routes/product.route.js

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product endpoints
 */


const express = require('express');
const router = express.Router();
const ProductController = require("../controller/product.controller.js");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js');


const productController = new ProductController();
router.post('/create', productController.createProduct);
router.put('/update/:id', authMiddleware, isAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware,isAdmin, productController.deleteProduct);
router.get('/colors', productController.getAllColor);
router.get('/brands', productController.getAllBrand);
router.get('/categories', productController.getAllCategory);
router.get('/:id', productController.getProduct);
router.get('/', productController.getAllProduct);
module.exports = router;
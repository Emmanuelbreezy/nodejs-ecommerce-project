// routes/brand.route.js

/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: Brand endpoints
 */

const express = require('express');
const router = express.Router();
const BrandController = require("../controller/brand.controller.js");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js');


const brandController = new BrandController();
router.post('/create', authMiddleware,isAdmin,brandController.createBrand);
router.put('/:id', authMiddleware,isAdmin, brandController.updateBrand);
router.delete('/:id',authMiddleware,isAdmin, brandController.deleteBrand);
router.get('/:id', brandController.getBrand);
router.get('/', brandController.getAllBrand);


module.exports = router;

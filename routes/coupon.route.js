// routes/coupon.route.js

/**
 * @swagger
 * tags:
 *   name: Coupon
 *   description: Coupon endpoints
 */

const express = require('express');
const router = express.Router();
const CouponController = require("../controller/coupon.controller.js");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js');


const couponController = new CouponController();
router.post('/create', authMiddleware,isAdmin,couponController.createCoupon);
router.put('/:id', authMiddleware,isAdmin, couponController.updateCoupon);
router.delete('/:id',authMiddleware,isAdmin, couponController.deleteCoupon);
router.get('/', authMiddleware,isAdmin,couponController.getAllCoupon);


module.exports = router;

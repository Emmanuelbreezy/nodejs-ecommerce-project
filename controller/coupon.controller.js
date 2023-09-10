const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');
const Coupon = require('../models/Coupon.model.js');


class CouponController {
     
    createCoupon = asyncHandler(async (req, res) => {
        try {
            const newCoupon = await Coupon.create(req.body);
            res.status(201).json({
				msg: "Coupon created successfully",
				data: newCoupon,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    getAllCoupon = asyncHandler(async (req, res) => {
        try {
            const getCoupon = await Coupon.find({});
            res.status(200).json({
				msg: "Coupon fetch successfully",
				data: getCoupon,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    updateCoupon = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
                new: true
            });
            res.status(200).json({
				msg: "Coupon updated successfully",
				data: updateCoupon,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    deleteCoupon = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            await Coupon.findByIdAndDelete(id);
            res.status(200).json({
				msg: "Coupon deleted successfully",
			});    
        } catch (error) {
			throw new Error(error);
        }
    });
}


module.exports =  CouponController;

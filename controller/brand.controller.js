const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');
const Brand = require('../models/Brand.model.js');


class BrandController {
     
    createBrand = asyncHandler(async (req, res) => {
        try {
            const newBrand = await Brand.create(req.body);
            res.status(201).json({
				msg: "Brand created successfully",
				data: newBrand,
			});    
        } catch (error) {
			throw new Error("Brand already exists");
        }
    });

    updateBrand = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
                new: true
            });
            res.status(200).json({
				msg: "Brand updated successfully",
				data: updateBrand,
			});    
        } catch (error) {
			throw new Error("Brand already exists");
        }
    });

    deleteBrand = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            await Brand.findByIdAndDelete(id);
            res.status(200).json({
				msg: "Brand deleted successfully",
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    getBrand = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            const _getBrand = await Brand.findById(id);
            if (!_getBrand) {
                // No matching product found to delete
                return res.status(404).json({ msg: 'Brand not found' });
            }
            res.status(200).json({
				msg: "Brand successfully",
				data: _getBrand,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    
    getAllBrand = asyncHandler(async (req, res) => {
        try {
            const getBrands = await Brand.find({});
            res.status(200).json({
				msg: "Brand successfully",
				data: getBrands,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });
}


module.exports =  BrandController;

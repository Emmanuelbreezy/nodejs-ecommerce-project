const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');
const Category = require('../models/Category.model.js');


class CategoryController {
     
    createCategory = asyncHandler(async (req, res) => {
        try {
            const newCategory = await Category.create(req.body);
            res.status(201).json({
				msg: "Category created successfully",
				data: newCategory,
			});    
        } catch (error) {
			throw new Error("Blog already exists");
        }
    });

    updateCategory = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
                new: true
            });
            res.status(200).json({
				msg: "Category updated successfully",
				data: updateCategory,
			});    
        } catch (error) {
			throw new Error("Category already exists");
        }
    });

    deleteCategory = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            await Category.findByIdAndDelete(id);
            res.status(200).json({
				msg: "Category deleted successfully",
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    getCategory = asyncHandler(async (req, res) => {
        const { id } = req.params
        validateMongodbId(id);
        try {
            const getCategory = await Category.findById(id);
            if (!getCategory) {
                // No matching product found to delete
                return res.status(404).json({ msg: 'Category not found' });
            }
            res.status(200).json({
				msg: "Category successfully",
				data: getCategory,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    
    getAllCategory = asyncHandler(async (req, res) => {
        try {
            const getCategories = await Category.find({});
            res.status(200).json({
				msg: "Category successfully",
				data: getCategories,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });
}


module.exports =  CategoryController;

const asyncHandler = require('express-async-handler');
const User = require('../models/User.model.js');
const Blog = require('../models/Blog.model.js');
const validateMongodbId = require('../utils/validateMongodbId.js');


class BlogController {
    
    createBlog = asyncHandler(async (req, res) => {
        try {
            const newBlog = await Blog.create(req.body);
            res.status(201).json({
				msg: "Blog created successfully",
				data: newBlog,
			});    
        } catch (error) {
			throw new Error("Blog already exists");
        }
    });

    updateBlog = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
                new: true
            });
            res.status(200).json({
				msg: "Blog updated successfully",
				data: updateBlog,
			});    
        } catch (error) {
			throw new Error("Blog already exists");
        }
    });

    getBlog = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const getBlog = await Blog.findById(id);
            await Blog.findByIdAndUpdate(
                id, 
                {
                    $inc: { numofViews: 1 },
                },
                { new: true}

                );
            res.status(200).json({
				msg: "Blog successfully",
				data: getBlog,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    getAllBlog = asyncHandler(async (req, res) => {
        try {
            const getBlogs = await Blog.find({});
            res.status(200).json({
				msg: "Blog successfully",
				data: getBlogs,
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    deleteBlog = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            await Blog.findByIdAndDelete(id);
            res.status(200).json({
				msg: "Blog deleted successfully",
			});    
        } catch (error) {
			throw new Error(error);
        }
    });
}

module.exports =  BlogController;
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');
const Blog = require('../models/Blog.model.js');
const cloudinaryUploadFile = require('../utils/cloudinary.js');


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
        const { id } = req.params;
        validateMongodbId(id);
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
        const { id } = req.params;
        validateMongodbId(id);
        try {
            const getBlog = await Blog.findById(id).populate("likes dislikes")
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
            const getBlogs = await Blog.find({}).populate('likes dislikes');
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
        validateMongodbId(id);
        try {
            await Blog.findByIdAndDelete(id);
            res.status(200).json({
				msg: "Blog deleted successfully",
			});    
        } catch (error) {
			throw new Error(error);
        }
    });

    likeBlog = asyncHandler(async (req, res) => {
        const { blogId } = req.body;
        validateMongodbId(blogId);
        const blog = await Blog.findById(blogId);
        const loginUserId = req?.user?._id;

        const isLiked = blog?.isLiked;

        const alreadyDisliked = blog?.dislikes?.find(
            (userId => userId.toString() === loginUserId.toString())
        );
        if(alreadyDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId},
                isDisliked: false
            },{new: true})

            res.json(blog);
        }

        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId},
                isLiked: false
            },{new: true})
            res.json(blog);
        }else{
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: loginUserId},
                isLiked: true
            },{new: true});
            res.json(blog);
        }
 
    });


    dislikeBlog = asyncHandler(async (req, res) => {
        const { blogId } = req.body;
        validateMongodbId(blogId);
        const blog = await Blog.findById(blogId);
        const loginUserId = req?.user?._id;

        const isDisLiked = blog?.isDisLiked;


        const alreadyLiked = blog?.likes?.find(
            (userId => userId.toString() === loginUserId.toString())
        );
        if(alreadyLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId},
                isLiked: false
            },{new: true})

            res.json(blog);
        }

        if(isDisLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId},
                isDisLiked: false
            },{new: true})
            res.json(blog);
        }else{
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { dislikes: loginUserId},
                isDisLiked: true
            },{new: true});
            res.json(blog);
        }
 
    });

    uploadImages = asyncHandler(async (req, res) => {
        const {id} = req.params;
        validateMongodbId(id);
        try {
            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({ msg: 'blog not found' });
            }

            const files = req.files;
            const { default: pMap } = await import('p-map');
            const uploadedUrls = await pMap(
                files,
                async (file) => {
                  try {
                    const url = await cloudinaryUploadFile(file.path);
                    fs.unlinkSync(file.path); // Remove the file after uploading
                    return url;
                  } catch (error) {
                    console.error(`Error uploading file: ${error.message}`);
                    return null; // Handle the error as needed
                  }
                },
                { concurrency: 5 } // Adjust concurrency to control parallelism
              );
            // const findBlog = await Blog.findByIdAndUpdate(id,{
            //     images: uploadedUrls
            // },{new:true});
            
            blog.images = uploadedUrls;
            await blog.save();
            res.json(blog);

        } catch (error) {
            throw new Error(error);
        }
    })
}

module.exports =  BlogController;
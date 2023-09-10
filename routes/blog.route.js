// routes/blog.route.js

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog endpoints
 */

const express = require('express');
const router = express.Router();
const BlogController = require("../controller/blog.controller.js");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware.js');
const { blogImageResize, uploadImage } = require('../middlewares/uploaderMiddleware.js');


const blogController = new BlogController();
router.post('/create', authMiddleware,isAdmin,blogController.createBlog);
router.put('/upload/:id', authMiddleware, 
    isAdmin,
    uploadImage.array('images', 2),
    blogImageResize,
    blogController.uploadImages
);
router.put('/dislike', authMiddleware,isAdmin, blogController.dislikeBlog);
router.put('/like', authMiddleware,isAdmin, blogController.likeBlog);
router.put('/:id', authMiddleware,isAdmin, blogController.updateBlog);
router.delete('/:id',authMiddleware,isAdmin, blogController.deleteBlog);
router.get('/:id', blogController.getBlog);
router.get('/', blogController.getAllBlog);
module.exports = router;

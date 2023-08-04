const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/Product.model.js');
const Colors = require('../models/Color.model.js');
const Brand = require('../models/Brand.model.js');
const Category = require('../models/Category.model.js');



class ProductController {

    createProduct = asyncHandler(async (req, res) => {
        try{
            if(req.body.title){
                req.body.slug = slugify(req.body.title);
            }
            const newProduct = await Product.create(req.body);
            const populatedProduct = await Product.populate(newProduct, [
                {
                  path: 'brand',
                  model: 'Brand', // The model to populate with
                },
                {
                  path: 'colors',
                  model: 'Colors', // The model to populate colorIds with
                },
                {
                    path: 'category',
                    model: 'Category',
                },
              ]);
            res.json({
                message: "Product created successfully",
                data: populatedProduct
            });
        } catch(err){
            throw new Error(err);
        }
    });

    updateProduct = asyncHandler(async (req, res) => {
        const { id } = req.params;
        try{
            if(req.body.title){
                req.body.slug = slugify(req.body.title);
            }
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ error: 'Invalid product ID.' });
              }

            const updatedProduct = await Product.findOneAndUpdate(
                { _id: id},
                { ...req.body },
                { new: true } // Set { new: true } to return the updated document
              );
            if (!updatedProduct) {
                res.status(404).json({ error: 'Product not found' });
              } else {
                res.json({
                    message: "success",
                    data: updatedProduct
                });
              }
        }catch(err){
            throw new Error(err);
        }
    });

    getProduct = asyncHandler(async (req, res) => { 
        const { id } = req.params;
        try{
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: 'Invalid product ID.' });
            }

            const findProduct = await Product.findById({_id:id}).populate('brand colors category');
            if (!findProduct) {
                return res.status(404).json({ 
                    message: 'Product not found',
                    status: 'error'
                });
            }
            res.json({
                message: "success",
                data: findProduct
            });
        }catch(err){
            throw new Error(err);
        }
    });

    getAllProduct = asyncHandler(async (req, res) => {
        try{
            const excludeFields = ['page', 'sort', 'limit', 'fields'];
            const { brand, category, colors,sort, price,fields, page, limit,...query } = req.query;
             // Exclude specific fields from the query
             excludeFields.forEach(field => delete query[field]);

           
            if (brand) {
                const brandObj = await Brand.findOne({ name: brand });
                if (brandObj) {
                  query.brand = brandObj._id;
                }
            }

            if (category) {
                const categoryObj = await Category.findOne({ name: category });
                if (categoryObj) {
                  query.category = categoryObj._id;
                }
            }

            if (Array.isArray(colors)) {
                const colorCodes = colors.map((color) => decodeURIComponent(color));
                const colorObjects = await Colors.find({ code: { $in: colorCodes } });
                const colorIds = colorObjects.map((color) => color._id);
                query.colors = { $in: colorIds };
            }

            if(price) {

                // Transform price conditions to numbers
                ['gte', 'gt', 'lte', 'lt'].forEach(op => {
                    if (price[op] && typeof price[op] === 'string') {
                        price[op] = parseFloat(price[op]);
                    }
                });
                // Build price query object
               const priceQuery = {};
               if (price.gte) priceQuery.$gte = price.gte;
               if (price.gt) priceQuery.$gt = price.gt;
               if (price.lte) priceQuery.$lte = price.lte;
               if (price.lt) priceQuery.$lt = price.lt;

               query.price = priceQuery; // Assign the priceQuery object to query.price


            //     let queryStr = JSON.stringify(price);
            //     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `${match}`);
            //     query.price = JSON.parse(queryStr);

            //    if (query.price.gte && typeof query.price.gte === 'string') {
            //         query.price.gte = parseFloat(query.price.gte);
            //     }
            //    if (query.price.gt && typeof query.price.gt === 'string') {
            //         query.price.gt = parseFloat(query.price.gt);
            //     }
            //     if (query.price.lte && typeof query.price.lte === 'string') {
            //         query.price.lte = parseFloat(query.price.lte);
            //     }
            //     if (query.price.lt && typeof query.price.lt === 'string') {
            //         query.price.lt = parseFloat(query.price.lt);
            //     }

                // const priceOperator = price.charAt(0);
                // const priceValue = parseFloat(price.slice(1));
                // console.log(priceValue, "price");

                // if(!isNaN(priceValue)) {
                //     switch(priceOperator) {
                //         case'>':
                //             query.price = {$gt: priceValue};
                //             break;
                //         case'<':
                //             query.price = {$lt: priceValue};
                //             break;
                //     }
                // }
            }


            const sortingOptions = {};

            if (sort) {
                const sortFields = sort.split(',').map(field => field.trim());
                sortFields.forEach(field => {
                    sortingOptions[field] = 1; // Ascending sort
                  });
            }else {
                sortingOptions.createdAt = -1; // Default sort by createdAt in descending order
            }

            const selectFields = fields ? fields.split(',') : []; 


            // Limit and Paginations 
            const limitValue = limit ? parseInt(limit) : undefined;
            const pageValue = page ? parseInt(page) : 1;
            const itemsPerPage = limitValue || 3; // Default to 10 items per page
            const skip =  (pageValue - 1) * itemsPerPage;

            const totalProducts = await Product.countDocuments(query);
            const totalPages = Math.ceil(totalProducts / itemsPerPage);
            const currentPage = pageValue > totalPages ? totalPages : pageValue;

            const nextPage = currentPage < totalPages ? `?page=${currentPage + 1}` : null;
            const prevPage = currentPage > 1 ? `?page=${currentPage - 1}` : null;


            const findProduct = await Product.find(query)
            .select(selectFields.join(' '))
            .populate('brand')
            .populate('colors')
            .populate('category')
            .sort(sortingOptions)
            .skip(skip)
            .limit(itemsPerPage)
            .exec();

            const pagination = {
                totalProducts,
                totalPages,
                currentPage,
                perPage: itemsPerPage,
                nextPage,
                prevPage
              };

            const response = {
                products:findProduct,
                pagination
            }

            res.json({
                message: "success",
                data: response
            });
        }catch(err){
            throw new Error(err);
        }
    });

    getAllColor = asyncHandler(async (req, res) => {
        try{
            const result = await Colors.find({});
            res.json(result);
        }catch(err){
            throw new Error(err);
        }
    });

    getAllBrand = asyncHandler(async (req, res) => {
        try{
            const result = await Brand.find({});
            res.json(result);
        }catch(err){
            throw new Error(err);
        }
    });

    
    getAllCategory = asyncHandler(async (req, res) => {
        try{
            const result = await Category.find({});
            res.json(result);
        }catch(err){
            throw new Error(err);
        }
    });

    deleteProduct = asyncHandler(async (req, res) => {
        const { id } = req.params;
        try{
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: 'Invalid product ID.' });
            }

            const deletedProduct = await Product.findByIdAndDelete({_id:id});
            if (!deletedProduct) {
                // No matching product found to delete
                return res.status(404).json({ message: 'Product not found' });
              }
          
            res.json({
                message: "Product deleted successfully",
            });
        }catch(err){
            throw new Error(err);
        }
    });
}

module.exports =  ProductController;
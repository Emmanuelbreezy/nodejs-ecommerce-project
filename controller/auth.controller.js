const asyncHandler = require('express-async-handler');
const User = require('../models/User.model.js');
const { generateToken } = require('../config/jwtToken.js');
const { generateRefreshToken } = require('../config/refreshToken.js');
const validateMongodbId = require('../utils/validateMongodbId.js');


class AuthController {

	createUser = asyncHandler(async (req, res) => {
		const email = req.body.email;
		const findUser = await User.findOne({ email: email });
		if(!findUser){
			const newUser = await User.create(req.body);
			res.status(201).json({
				msg: "Register successfully",
				data: newUser,
				success: true,
				status: 201
			});
		}else{
			throw new Error("User already exists");
		}
	});

	login = asyncHandler(async (req, res) => {
		try{
			const { email, password } = req.body;
			const findUser = await User.findOne({ email: email });
			
			if(findUser && (await findUser.isPasswordMatch(password))){
				const { _id, password, ...rest } = findUser._doc;
				const token  =  generateToken(_id);
				const refreshToken = await generateRefreshToken(_id);
				const updateUser = await User.findByIdAndUpdate(id,{
					refreshToken},{new:true});
				res.cookie('refreshToken', refreshToken,{
					httpOnly: true,
					maxAge: 72 * 60 * 60 * 1000
				})
				res.status(200).json({
					msg: "Fetch successfully",
					data: {_id, ...rest, token}
				})
			}else{
				res.status(401).json({
					msg: "Invalid email or password",
				})
			}

		}catch(err) {
			throw new Error(err);
		}
	});

	handleRefreshToken = asyncHandler(async(req, res) => {});

	getAllUsers = asyncHandler(async (req, res) => {
		try{
			const getUsers = await User.find({}).select("-password");
			res.status(200).json({
                msg: "Fetch successfully",
                data: getUsers
            })
		}catch(err){
			throw new Error(err);
		}
	});

	getSingleUser = asyncHandler(async (req, res) => {
		const { id } = req.params;
		validateMongodbId(id);
		try{
			const user = await User.findOne({_id: id}).select("-password");
			if(user){
				res.status(200).json({
                    msg: "Fetch successfully",
                    data: user
                })
			}else{
				throw new Error("User does not exist");
			}
		}catch(err){
			throw new Error(err);
		}
	});

	
	deleteUser = asyncHandler(async (req, res) => {
		const { id } = req.params;
		validateMongodbId(id);
		try{
			const user = await User.findByIdAndDelete(id);
			if(user){
				res.status(200).json({
                    msg: "Delete user successfully",
                })
			}else{
				throw new Error("User does not exist");
			}
		}catch(err){
			throw new Error(err);
		}
	});


	updateUser = asyncHandler(async (req, res) => {
		const { id } = req.params;
		validateMongodbId(id);
		try{
			const user = await User.findById(id);
			if(user){
				const updatedUser = await User.findByIdAndUpdate(id, 
					{
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						mobile: req.body.mobile,

					}, { new: true });

				res.status(200).json({
                    msg: "Fetched successfully",
					data: updatedUser
                });

			}else{
				throw new Error("User does not exist");
			}
		}catch(err){
			throw new Error(err);
		}
	});

	blockUser = asyncHandler(async (req, res) => {
		const { id } = req.params;
		validateMongodbId(id);
		try {
			const block = await User.findByIdAndUpdate(id,{
				isBlocked: true
			},{new: true});

			res.status(200).json({
				msg: "User blocked successfully",
				data: block
			});
			
		}catch(err){
			throw new Error(error)
		}
	});


	unblockUser = asyncHandler(async (req, res) => {
		const { id } = req.params;
		validateMongodbId(id);
		try {
			const unblock = await User.findByIdAndUpdate(id,{
				isBlocked: false
			},{new: true});

			res.status(200).json({
				msg: "User unblocked successfully",
				data: unblock
			});
			
		}catch(err){
			throw new Error(error)
		}
	});
}

module.exports =  AuthController;
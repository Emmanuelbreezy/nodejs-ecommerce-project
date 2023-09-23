const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { roles } = require('../utils/roles');

const authMiddleware = asyncHandler(async (req, res, next) => {
	let token;
	if(req?.headers?.authorization?.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
		try { 
			if(token) {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const user = await User.findById(decoded.id);
				req.user = user;
				next();
			}
		}catch(err) {
			throw new Error('Not authorized token expired, Please Login again');
		}
	}else{
		throw new Error("There is not token attached to headers");
	}
});


const isAdmin = asyncHandler(async (req, res, next) => {
	const { email } = req.user;
	const adminUser = await User.findOne({email: email});
	console.log(adminUser, "adminUser")

	if (!adminUser) {
		throw new Error('User not found'); // Handle the case where the user is not found
	  }
	if(adminUser.role === roles.admin){
		next();
	}else{
		throw new Error('Not authorized');
	}
});

module.exports = {authMiddleware,isAdmin};
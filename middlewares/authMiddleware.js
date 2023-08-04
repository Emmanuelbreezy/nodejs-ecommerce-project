const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
	let token;
	if(req?.headers?.authorization?.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
		console.log(token);
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
	if(adminUser.role !== 'admin'){
		throw new Error('Not authorized');
	}else{
		next();
	}
});

module.exports = {authMiddleware,isAdmin};
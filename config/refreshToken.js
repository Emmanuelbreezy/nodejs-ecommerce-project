const jwt = require('jsonwebtoken');


const generateRefreshToken = async (id,role) => {
	return await jwt.sign({id:id}, process.env.JWT_SECRET, { expiresIn: "2d" });
}

module.exports = { generateRefreshToken }
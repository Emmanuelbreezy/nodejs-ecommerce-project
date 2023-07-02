const mongoose = require("mongoose");


const dbConnect = () => {
	try {
		const connect = mongoose.connect(process.env.MONGODB_URI);
		console.log("Database connection established")
	}catch(err) {
		console.log("Database connection error")
	}
}

module.exports = dbConnect;
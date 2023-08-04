const mongoose = require("mongoose");


const dbConnect = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold);
	}catch(err) {
		console.log(`MongoDB Failed: ${err}`);
	}
}

module.exports = dbConnect;
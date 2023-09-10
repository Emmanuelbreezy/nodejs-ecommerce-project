const mongoose = require("mongoose");


const dbConnect = async () => {
	try {
		const options = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 10000
		};
		await mongoose.connect(process.env.MONGODB_URI);
		// Connection events
		mongoose.connection.on('connected', () => {
			console.log('Connected to MongoDB');
		});

		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
		});

		mongoose.connection.on('reconnected', () => {
			console.log('MongoDB reconnected');
		});

		mongoose.connection.on('open', () => {
			console.log(`MongoDB Connected: ${mongoose.connection.host}`);
		});
		console.log(`MongoDB Connected: ${mongoose.connection.host}`);

	}catch(err) {
		console.log(`MongoDB Failed: ${err}`);
	}
}

module.exports = dbConnect;
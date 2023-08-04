const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	title:{
		type:String,
		required: true,
        trim: true,
	},
	slug:{
		type:String,
		required: true,
        unique: true,
        lowercase: true,
 	},
	description:{
		type:String,
		required: true,
	},
	price:{
		type:Number,
		required: true,
	},
    quantity:{
		type:Number,
		required: true,
		default: 1,
	},
    sold: {
        type: Number,
        default: 0,
		select: false
    },
    images: {
        type: Array,
        default: []
    },
    colors: [{ 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Colors' 
	  }],
    ratings: [{
            star: Number,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    }],
	category: {
		type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
	},
	brand:{
		type:mongoose.Schema.Types.ObjectId,
        ref: "Brand",
		required: true,
	},
},{
 timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
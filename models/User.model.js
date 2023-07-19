const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	firstname:{
		type:String,
		required: true,
	},
	lastname:{
		type:String,
		required: true,
 	},
	email:{
		type:String,
        required: true,
        unique: true,
	},
	mobile:{
		type:String,
		required: true,
		unique: true
	},
	password:{
		type:String,
		required: true,
	},
	role: {
		type:String,
        default: "user"
	},
	isBlocked:{
		type:Boolean,
        default: false
	},
	cart:{
		type:Array,
		default: []
	},
	address:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Address"
	}],
	wishList: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product"
	}],
	refreshToken:{
		type: String,
	}
},{
 timestamps: true
});

userSchema.pre('save', async function(next) {
	const salt = await bcrypt.genSaltSync(10);
	this.password = await bcrypt.hashSync(this.password, salt);
});

userSchema.methods.isPasswordMatch = async function(enterPassword) {
	return  await bcrypt.compare(enterPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);
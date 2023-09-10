const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true
    },
  expiry:{
    type:Date,
    required: true,
  },
  discountType: {
    type: String,
    required: true,
    default: 'percent'
  },
  discount:{
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Coupon', couponSchema);

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
        product:{
            type: mongoose.Schema.Types.ObjectId, 
			ref: 'Product' 
        },
        count: Number,
        color: {
          type: mongoose.Schema.Types.ObjectId,
			    ref: 'Colors' 
        },
        price: Number,
    }
  ],
  cartTotal: Number,
  totalAfterDiscount: Number,
  paymentIntent:{},
  orderStatus: {
    type: String,
    default: 'Not Processed',
    enum: [
        'Not Processed', 
        'Cash on Delivery', 
        'Processing',
        'Dispatched',
        'Cancelled',
        'Delivered',
    ]
  },
  orderby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{ timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);

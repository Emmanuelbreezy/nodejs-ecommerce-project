const mongoose = require('mongoose');

const colorsSchema = new mongoose.Schema({
  name: { 
        type: String, 
        required: true 
    },
  code: { 
    type: String, 
    required: true 
  }, 
});

module.exports = mongoose.model('Colors', colorsSchema);

const mongoose = require('mongoose');

const validateMongodbId = (id) => {
  if (!id) {
    throw new Error('Id is required');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('This id is not valid');
  }
};

module.exports = validateMongodbId;


// const mongoose = require('mongoose');


// const validateMongodbId = id => {
// 	if(id){
// 		const isValid = mongoose.Schema.Types.ObjectId.isValid(id);
// 		if(!isValid) throw new Error('This id is not valid')
// 	}else{
// 		throw new Error('Id is required')
// 	}

// }

// module.exports = validateMongodbId;
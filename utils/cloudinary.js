 
require('dotenv').config();
 const cloudinary = require('cloudinary').v2;

 cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
 });

 const cloudinaryUploadFile = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, (error,result)=>{
            if (error) {
                reject(error);
              } else {
                resolve(
                    {
                         url: result.secure_url,
                      
                    },{
                        resource_type: "auto"
                    }
                )
              }
        })
    })
 }

module.exports = cloudinaryUploadFile;
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const Product = require("../models/Product");
const { createToken, attachCookiesToResponse } = require("../utils");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const createProduct = async(req , res)=>{
    const {
        name,
       
        
       price,
        images,
        category,
        description,
      } = req.body;

      if(!name || !price ||!images ||!category ||!description){
        throw new BadRequestError("provide all values")
      }
      let response = [];
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image); // Upload each image to Cloudinary
        response.push(result.secure_url); // 
      }


      const product =await Product.create({
        name , price , response, description , category
      })

      res.status(StatusCodes.CREATED).json({success:true , product})

}
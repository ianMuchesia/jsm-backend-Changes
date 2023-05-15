const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Product = require("../models/Product");
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


const getSingleProduct = async(req , res)=>{
  const { productID} = req.params

 const product = await Product.findOne({_id:productID})

 if(!product){
  throw new NotFoundError("Product with id:{productID} not found")
 }

 res.status(StatusCodes.OK).json({success: true , product})
}


const getAllProducts = async (req, res) => {
  const { category, search, sort } = req.query;

  const queryObject = {};

  if (category) {
    queryObject.category = category;
  }

  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  let result = Product.find(queryObject)

  if (sort) {
    const sortArray = sort.split(",").join(" ");
    result = result.sort(sortArray);
  } else {
    result = result.sort("name");
  }

  const products = await result;

  res.status(StatusCodes.OK).json({ success: true, products });
};

module.exports = {createProduct , getAllProducts , getSingleProduct}
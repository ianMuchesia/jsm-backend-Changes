const mongoose = require('mongoose')

;

//Slugs are used in web development and search engine optimization (SEO) to create more readable and user-friendly URLs.

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "product price must be provided"],
    },
   
    
    
    category: {
      type: String,
      enum: {
        values: [
          "Watches",
          "Headphones",
          "Earphones",
          "Speakers",
         
        ],
      },
    },
 

    images: {
      type:[String],
    },
    featured: {
      type: Boolean,
      default: false,
    },

    InStock: {
      type: Number,
      required: [true, "Number of products in stock must be provided"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 4,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});


ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;

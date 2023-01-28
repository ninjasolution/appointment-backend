const mongoose = require("mongoose");
const timestamps = require('mongoose-unix-timestamp-plugin');
const mongoosePaginate = require('mongoose-paginate-v2');


module.exports = (connection, autoIncrement) => {

  const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    user: {
      type: Number,
      ref: "User",
    },
    barcode: {
      type: String,
      unique: true
    },
    brand: {
      type: String,
      ref: "Brand"
    },
    measure: {
      type: String,
      ref: "Measure"
    },
    shortDescription: {
      type: String
    },
    description: {
      type: String
    },
    category: {
      type: Number,
      ref: "Category"
    },
    image: {
      type: String
    },
    currency: {
      type: Number,
      ref: "Currency"
    },
    supplyPrice: {
      type: Number,
    },
    retailPrice: {
      type: Number
    },
    specialPrice: {
      type: Number
    },
    markupPrice: {
      type: Number
    },
    enableRetailSale: {
      type: Boolean,
      default: false
    },
    enableCommission: {
      type: Boolean,
      default: false
    },
    tax: {
      type: Number,
      ref: "Tax"
    },
    sku: {
      type: String
    },
    supplier: {
      type: Number,
      ref: "User"
    },
    quantity: {
      type: Number,
      default: 0
    },
    lowStockLevel: {
      type: Number,
      default: 0
    },
    reorderQuantity: {
      type: Number,
      default: 0
    },
    enableLowStockNotification: {
      type: Boolean,
      default: false
    },
    
  });
  
  ProductSchema.plugin(timestamps);
  ProductSchema.plugin(mongoosePaginate);
  ProductSchema.plugin(autoIncrement.plugin, "Product")  

  const Product = connection.model(
    "Product",
    ProductSchema
  );

  return Product;
}
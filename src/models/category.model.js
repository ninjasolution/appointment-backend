const mongoose = require("mongoose");
var timestamps = require('mongoose-unix-timestamp-plugin');

module.exports = (connection, autoIncrement) => {

  const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    description: {
      type: String
    },
    type: {
      type: Number,
      ref: "CategoryType"
    },
    user: {
      type: Number,
      ref: "User"
    }
  })
  
  CategorySchema.plugin(timestamps)
  CategorySchema.plugin(autoIncrement.plugin, "Category")
  
  const Category = connection.model(
    "Category",
    CategorySchema  
  );

  return Category;
}

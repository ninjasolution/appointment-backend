const mongoose = require("mongoose");
var timestamps = require('mongoose-unix-timestamp-plugin');

module.exports = (connection, autoIncrement) => {

  const CategoryTypeSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    }
  })
  
  CategoryTypeSchema.plugin(timestamps)
  CategoryTypeSchema.plugin(autoIncrement.plugin, "CategoryType")
  
  const CategoryType = connection.model(
    "CategoryType",
    CategoryTypeSchema  
  );

  return CategoryType;
}

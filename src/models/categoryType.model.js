const mongoose = require("mongoose");

module.exports = (connection, autoIncrement) => {

  const CategoryTypeSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    }
  })
  
  CategoryTypeSchema.plugin(autoIncrement.plugin, "CategoryType")
  
  const CategoryType = connection.model(
    "CategoryType",
    CategoryTypeSchema  
  );

  return CategoryType;
}

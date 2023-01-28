const mongoose = require("mongoose");

module.exports = (connection, autoIncrement) => {

  const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
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
  
  CategorySchema.plugin(autoIncrement.plugin, "Category")
  
  const Category = connection.model(
    "Category",
    CategorySchema  
  );

  return Category;
}

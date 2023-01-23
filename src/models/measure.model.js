const mongoose = require("mongoose");

module.exports = (connection, autoIncrement) => {

  const MeasureSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
  })
  
  MeasureSchema.plugin(timestamps)
  
  const Measure = connection.model(
    "Measure",
    MeasureSchema  
  );

  return Measure;
}

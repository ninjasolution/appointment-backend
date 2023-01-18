const mongoose = require("mongoose");
var timestamps = require('mongoose-unix-timestamp-plugin');

module.exports = (connection, autoIncrement) => {

  const MeasureSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
  })
  
  MeasureSchema.plugin(timestamps)
  MeasureSchema.plugin(autoIncrement.plugin, "Measure")
  
  const Measure = connection.model(
    "Measure",
    MeasureSchema  
  );

  return Measure;
}

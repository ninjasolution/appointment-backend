const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');


module.exports = (connection, autoIncrement) => {

  const TreatmentSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    user: {
      type: Number,
      ref: "User"
    }
  });
  TreatmentSchema.plugin(autoIncrement.plugin, "Treatment")
  TreatmentSchema.plugin(timestamps);
  TreatmentSchema.plugin(mongoosePaginate);

  const Treatment = connection.model(
    "Treatment",
    TreatmentSchema
  );
  return Treatment;
}

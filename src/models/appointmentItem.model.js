const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (connection, autoIncrement) => {

  const AppointmentItemSchema = new mongoose.Schema({
    startTime: Number,
    service: {
      type: Number,
      ref: "Service"
    },
    duration: Number,
    member: {
      type: Number,
      ref: "User"
    },
    appointment: {
      type: Number,
      ref: "Appointment"
    }
  });

  AppointmentItemSchema.plugin(autoIncrement.plugin, "AppointmentItem")
  // AppointmentItemSchema.plugin(timestamps);
  AppointmentItemSchema.plugin(mongoosePaginate);

  const AppointmentItem = connection.model(
    "AppointmentItem",
    AppointmentItemSchema
  );
  return AppointmentItem;
}

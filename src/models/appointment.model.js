const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (connection, autoIncrement) => {

  const AppointmentSchema = new mongoose.Schema({
    items: [{
      type: Number,
      ref: "AppointmentItem"
    }],
    note: {
      type: String
    },
    status: {
      type: Number,
      default: 0
    },
    user: {
      type: Number,
      ref: "User"
    },
    client: {
      type: Number,
      ref: "User"
    }
  });

  AppointmentSchema.plugin(autoIncrement.plugin, "Appointment")
  AppointmentSchema.plugin(timestamps);
  AppointmentSchema.plugin(mongoosePaginate);

  const Appointment = connection.model(
    "Appointment",
    AppointmentSchema
  );
  return Appointment;
}

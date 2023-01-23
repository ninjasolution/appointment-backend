const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (connection, autoIncrement) => {

  const AppointmentSchema = new mongoose.Schema({
    appointments: [{
      type: {
        startTime: Number,
        service: {
          type: Number,
          ref: "Service"
        },
        duration: Number,
        member: {
          type: Number,
          ref: "User"
        }
      }
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

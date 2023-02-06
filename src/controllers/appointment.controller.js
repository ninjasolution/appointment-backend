const db = require("../models");
const Appointment = db.appointment;
const AppointmentItem = db.appointmentItem;
const config = require("../config/index")

exports.create = (req, res) => {
  try {

    if (req.body.appointments && req.body.appointments.length < 1) {
      if (err) {
        res.status(500).send({ message: config.RES_MSG_INVALID_REQUEST, status: config.RES_STATUS_FAIL });
        return;
      }
    }
    const appointment = new Appointment({
      note: req.body.note,
      status: req.body.status,
      user: req.userId,
      client: req.body.clientId
    })

    appointment.save(async (err, _appointment) => {
      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      var items = [];

      for (let i = 0; i < req.body.appointments.length; i++) {
        var item = new AppointmentItem({
          startTime: new Date(req.body.appointments[i].startTime),
          service: req.body.appointments[i].serviceId,
          duration: req.body.appointments[i].duration,
          member: req.body.appointments[i].memberId,
          appointment: _appointment._id,
        })
        item = await item.save();
        items.push(item._id);
      }

      _appointment.items = items;
      await _appointment.save();

      return res.status(200).send({
        message: config.RES_MSG_SAVE_SUCCESS,
        data: _appointment,
        status: config.RES_STATUS_SUCCESS,
      });
    });
  } catch (err) {
    res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
    return;
  }
}

exports.getAll = (req, res) => {

  var query = {
    "appointment.user": req.userId,
  }

  // if (req.query.from) {
  //   query.$gte = { createdAt: req.query.from };
  // }

  // if (req.query.from) {
  //   query.$lte = { createdAt: req.query.to };
  // }

  AppointmentItem.find()
    .populate({path: 'appointment', match: {"appointment.user": req.userId}, select: "-__v -items", populate: [{path: "user", select: "firstName lastName _id"}, {path: "client", select: "firstName lastName _id"}]})
    .populate('member', "firstName lastName _id")
    .populate('service', "name _id")
    .exec((err, appointments) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!appointments) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: appointments,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.getById = (req, res) => {

  Appointment.findOne({ _id: req.params.id })
    .populate({path: 'items', model: "AppointmentItem", populate: [{
      path: "member", select: "firstName lastName"
    }, {
      path: "service", select: "name"
    }]})
    .populate('user', "firstName lastName _id")
    .populate('client', "firstName lastName _id")
    .exec((err, appointment) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!appointment) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: appointment,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Appointment.updateOne({ _id: req.params.id }, req.body)
    .exec(async (err, appointment) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: appointment,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};


exports.delete = (req, res) => {
  Appointment.deleteOne({ _id: req.params.id })
    .exec((err) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_DELETE_FAIL });
        return;
      }
      return res.status(200).send({
        message: config.RES_MSG_DELETE_SUCCESS,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

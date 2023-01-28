const db = require("../models");
const Appointment = db.appointment;
const AppointmentItem = db.appointmentItem;
const config = require("../config/index")

exports.create = (req, res) => {
  if (req.body.appointments?.length && req.body.appointments.length < 1) {
    if (err) {
      res.status(400).send({ message: config.RES_MSG_INVALID_REQUEST, status: config.RES_STATUS_FAIL });
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
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    var items = [];

    for (let i = 0; i < req.body.appointments.length; i++) {
      const item = new AppointmentItem({
        startTime: req.body.appointments[i].startTime,
        service: req.body.appointments[i].serviceId,
        duration: req.body.appointments[i].duration,
        member: req.body.appointments[i].memberId,
        appointment: appointment._id,
      })
      await item.save();
      items.push(item._id);
    }

    appointment.items = items;
    await appointment.save();

    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: _appointment,
      status: config.RES_STATUS_SUCCESS,
    });
  });
}

exports.getAll = (req, res) => {
  var options = {
    sort: { createdAt: -1 },
    page: req.query.page || 0,
    limit: req.query.limit || 10,
  };

  var query = {
    user: req.userId,
  }

  if (req.query.from) {
    query.$gte = { createdAt: req.query.from };
  }

  if (req.query.from) {
    query.$lte = { createdAt: req.query.to };
  }

  AppointmentItem.find(query)
    .populate('appointment', "-__v -items")
    .populate('member', "name _id")
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

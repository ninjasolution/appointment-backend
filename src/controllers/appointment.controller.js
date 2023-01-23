const db = require("../models");
const Appointment = db.appointment;
const config = require("../config/index")

exports.create = (req, res) => {
  const appointment = new Appointment({
    note: req.body.note,
    status: req.body.status,
    appointments: req.body.appointments,
    user: req.userId
  })

  appointment.save(async (err, _appointment) => {
    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

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
  Appointment.paginate({user: req.userId}, options)
    .exec((err, appointments) => {

      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
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

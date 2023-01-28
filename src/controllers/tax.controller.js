const db = require("../models");
const Tax = db.tax;
const config = require("../config/index")

exports.create = (req, res) => {
  const tax = new Tax({
    name: req.body.name,
    user: req.userId
  })

  tax.save(async (err, _tax) => {
    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: _tax,
      status: config.RES_STATUS_SUCCESS,
    });
  });
}

exports.getAll = (req, res) => {
  Tax.find({user: req.userId})
    .exec((err, taxes) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!taxes) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: taxes,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Tax.updateOne({ _id: req.params.id }, {name: req.body.name})
    .exec(async (err, tax) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: tax,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};


exports.delete = (req, res) => {
  Tax.deleteOne({ _id: req.params.id })
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

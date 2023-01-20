const db = require("../models");
const Voucher = db.voucher;
const config = require("../config/index")

exports.create = (req, res) => {
  const voucher = new Voucher({
    name: req.body.name,
    user: req.userId,
    value: req.body.value,
    retailPrice: req.body.retailPrice,
    enableLimitedSale: req.body.enableLimitedSale,
    services: req.body.serviceIds,
    count: req.body.count,
    duration: req.body.duration,
    title: req.body.title,
    description: req.body.description,
  })

  voucher.save(async (err, _voucher) => {
    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: _voucher,
      status: config.RES_STATUS_SUCCESS,
    });
  });
}

exports.getAll = (req, res) => {
  Voucher.find({user: req.userId})
    .exec((err, vouchers) => {

      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!vouchers) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: vouchers,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Voucher.updateOne({ _id: req.params.id }, req.body)
    .exec((err, voucher) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: voucher,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};


exports.delete = (req, res) => {
  Voucher.deleteOne({ _id: req.params.id })
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

const db = require("../models");
const Service = db.service;
const config = require("../config/index")

exports.create = (req, res) => {
  const service = new Service({
    name: req.body.name,
    user: req.userId,
    treatment: req.body.treatment,
    description: req.body.description,
    aftercareDescription: req.body.userId,
    target: req.body.target,
    members: req.body.memberIds,
    enableOnline: req.body.enableOnline,
    priceAndDurations: req.body.priceAndDurations,
    extraTime: req.body.extraTime,
    tax: req.body.taxId,
    enableVoucherSale: req.body.enableVoucherSale,
    voucherExpierPeriod: req.body.voucherExpierPeriod,
    enableMemberCommission: req.body.enableMemberCommission,
    enableUpsell: req.body.enableUpsell,
    upsellServices: req.body.upsellServiceIds,
    discountPercent: req.body.discountPercent,
  })

  service.save(async (err, _service) => {
    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: _service,
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
  Service.paginate({user: req.userId}, options)
    .exec((err, services) => {

      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!services) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: services,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Service.updateOne({ _id: req.params.id }, { name: req.body.name })
    .exec((err, service) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: service,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};


exports.delete = (req, res) => {
  Service.deleteOne({ _id: req.params.id })
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

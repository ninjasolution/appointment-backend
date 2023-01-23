const db = require("../models");
const Membership = db.membership;
const config = require("../config/index")

exports.create = (req, res) => {
  const membership = new Membership({
    name: req.body.name,
    user: req.userId,
    description: req.body.description,
    services: req.body.serviceIds,
    enableLimit: req.body.enableLimit,
    numberOfSession: req.body.numberOfSession,
    duration: req.body.duration,
    price: req.body.price,
    tax: req.body.taxId,
    color: req.body.color,
    enableOnlineSale: req.body.enableOnlineSale,
    condition: req.body.condition,
  })

  membership.save(async (err, _membership) => {
    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: _membership,
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

  if(req.query.from) {
    query.$gte = { createdAt: req.query.from };
  }

  if(req.query.from) {
    query.$lte = { createdAt: req.query.to };
  }
  Membership.paginate(query, options)
    .exec((err, memberships) => {

      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!memberships) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: memberships,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Membership.updateOne({ _id: req.params.id }, req.body)
    .exec((err, membership) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: membership,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.delete = (req, res) => {
  Membership.deleteOne({ _id: req.params.id })
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

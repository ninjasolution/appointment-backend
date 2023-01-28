const db = require("../models");
const Cart = db.cart;
const Transaction = db.transaction;
const Product = db.product;
const config = require("../config/index")

exports.create = async (req, res) => {

  const transaction = new Transaction({
    status: req.body.status,
    type: req.body.type,
    user: req.userId,
    payment: req.body.payment,
    tip: req.body.tip,
    client: req.body.client
  })

  switch (req.body.type) {
    case config.TRX_TYPE_PRODUCT:
      transaction.product = req.body.productId;
      break;
    case config.TRX_TYPE_MEMBERSHIP:
      transaction.membership = req.body.membershipId;
      break;
    case config.TRX_TYPE_SERVICE:
      transaction.service = req.body.serviceId;
      break;
    case config.TRX_TYPE_VOUCHER:
      transaction.voucher = req.body.voucherId;
      break;
    default:
      break;
  }


  await transaction.save();
  return res.status(200).send({
    message: config.RES_MSG_SAVE_SUCCESS,
    data: transaction,
    status: config.RES_STATUS_SUCCESS,
  });
}

exports.getAll = (req, res) => {

  var options = {
    sort: { date: -1 },
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
  
  Transaction.paginate(query, options, (err, transactions) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!transactions) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: transactions.docs,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Transaction.updateOne({ _id: req.params.id }, req.body)
    .exec(async (err, transaction) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: transaction,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.delete = (req, res) => {
  Transaction.deleteOne({ _id: req.params.id })
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

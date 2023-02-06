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
    tip: req.body.tipId,
    client: req.body.clientId
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
    page: req.query.page|| 1,
    limit: req.query.limit || 10,
    populate: [
      {path: 'client', select: "firstName lastName _id"},
      {path: 'product'},
      {path: 'membership'},
      {path: 'service'},
      {path: 'user', select: "firstName lastName _id"}
    ],
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

exports.getById = (req, res) => {
 
  Transaction.findOne({_id: req.params.id})
    .populate('product', "-__v")
    .populate('service', "-__v")
    .populate('membership', "-__v")
    .populate('voucher', "-__v")
    .populate('user', "firstName lastName _id")
    .populate('client', "firstName lastName _id")
    .exec((err, transaction) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!transaction) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: transaction,
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

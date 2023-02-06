const db = require("../models");
const Cart = db.cart;
const Order = db.order;
const Product = db.product;
const config = require("../config/index")

exports.create = async (req, res) => {

  if (req.body.carts > 0) {

    var carts = [];
    for (let i = 0; i < req.body.carts.length; i++) {
      if (req.body.type == config.ORDER_TYPE_SALE) {
        Product.updateOne({ _id: req.body.carts[i].productId }, { $inc: { quantity: req.body.carts[i].quantity * -1 } })
      }

      let cart = new Cart({
        product: req.body.carts[i].productId,
        quantity: req.body.carts[i].quantity,
        price: req.body.carts[i].price
      })
      cart = await cart.save();
      carts.push(cart._id);
    }

    const order = new Order({
      carts,
      note: req.body.note,
      status: req.body.status,
      type: req.body.type,
      user: req.userId,
      to: req.body.supplierId
    })

    await order.save();
    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: order,
      status: config.RES_STATUS_SUCCESS,
    });
  }
}

exports.getAll = (req, res) => {
  var options = {
    sort: { createdAt: -1 },
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    populate: [{
      path: "carts", model: "Cart", populate: [{
        path: "product", select: "Product"
      }]
    }, {
      path: "user", select: "firstName lastName _id"
    }, {
      path: "to", select: "firstName lastName _id"
    }]
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

  Order.paginate(query, options, (err, orders) => {

    if (err) {
      res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    if (!orders) {
      return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
    }

    return res.status(200).send({
      message: config.RES_MSG_DATA_FOUND,
      data: orders.docs,
      status: config.RES_STATUS_SUCCESS,
    });
  })
};

exports.getById = (req, res) => {

  Order.findOne({ _id: req.params.id })
    .populate({
      path: 'carts', model: "Cart", populate: [{
        path: "product", model: "Product"
      }]
    })
    .populate('user', "-__v")
    .populate('to', "-__v")
    .exec((err, order) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!order) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: order,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};


exports.update = (req, res) => {
  Order.updateOne({ _id: req.params.id }, req.body)
    .exec(async (err, brand) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: brand,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.delete = (req, res) => {
  Order.deleteOne({ _id: req.params.id })
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

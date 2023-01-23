const db = require("../models");
const Cart = db.cart;
const Order = db.order;
const Product = db.product;
const config = require("../config/index")

exports.create = async (req, res) => {

  if(req.body.carts?.length > 0) {

    var carts = [];
    for(let i=0 ; i<req.body.carts?.length ; i ++) {
      if(req.body.type == config.ORDER_TYPE_SALE) {
        Product.updateOne({_id: req.body.carts[i].productId}, {$inc: {quantity: req.body.carts[i].quantity * -1}})
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
      to: req.body.supplier
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
  
  Order.paginate(query, options)
    .exec((err, orders) => {

      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!orders) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: orders,
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

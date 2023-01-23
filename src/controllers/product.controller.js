const db = require("../models");
const Product = db.product;
const config = require("../config/index")

exports.create = (req, res) => {
  const product = new Product({
    name: req.body.name,
    user: req.userId,
    barcode: req.body.barcode,
    brand: req.body.brandId,
    shortDescription: req.body.shortDescription,
    description: req.body.description,
    category: req.body.categoryId,
    image: req.body.image,
    currency: req.body.currencyId,
    supplyPrice: req.body.supplyPrice,
    retailPrice: req.body.retailPrice,
    specialPrice: req.body.specialPrice,
    enableRetailSale: req.body.enableRetailSale,
    enableMemberCommission: req.body.enableMemberCommission,
    tax: req.body.taxId,
    sku: req.body.sku,
    supplier: req.body.supplierId,
    quantity: req.body.quantity,
    lowStockLevel: req.body.lowStockLevel,
    reorderQuantity: req.body.reorderQuantity,
    enableLowStockNotification: req.body.enableLowStockNotification
  })

  product.save(async (err, _product) => {
    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: _product,
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
  Product.paginate({user: req.userId}, options)
    .exec((err, products) => {

      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!products) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: products,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Product.updateOne({ _id: req.params.id }, req.body)
    .exec((err, product) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: product,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};


exports.delete = (req, res) => {
  Product.deleteOne({ _id: req.params.id })
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

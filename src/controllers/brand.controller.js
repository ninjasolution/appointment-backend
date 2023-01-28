const db = require("../models");
const Brand = db.brand;
const config = require("../config/index")

exports.create = (req, res) => {
  const brand = new Brand({
    name: req.body.name,
    user: req.userId
  })

  brand.save(async (err, _brand) => {
    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    return res.status(200).send({
      message: config.RES_MSG_SAVE_SUCCESS,
      data: _brand,
      status: config.RES_STATUS_SUCCESS,
    });
  });
}

exports.getAll = (req, res) => {
  Brand.find({user: req.userId})
    .exec((err, brands) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!brands) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: brands,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Brand.updateOne({ _id: req.params.id }, {name: req.body.name})
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
  Brand.deleteOne({ _id: req.params.id })
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

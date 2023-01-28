const db = require("../models");
const Category = db.category;
const CategoryType = db.categoryType;
const config = require("../config/index");

exports.create = (req, res) => {

  CategoryType.findOne({name: req.body.type}, (err, type) => {
    if (err) {
      res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    if(type == null) {
      res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_FAIL });
      return;
    }
    const category = new Category({
      name: req.body.name,
      user: req.userId,
      type: type._id
    })
  
    category.save(async (err, _category) => {
      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }
  
      return res.status(200).send({
        message: config.RES_MSG_SAVE_SUCCESS,
        data: _category,
        status: config.RES_STATUS_SUCCESS,
      });
    });
  })
  
}

exports.getAll = (req, res) => {
  Category.find({user: req.userId})
    .exec((err, categories) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!categories) {
        return res.status(404).send({ message: config.RES_MSG_DATA_NOT_FOUND, status: config.RES_STATUS_SUCCESS });
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: categories,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};

exports.update = (req, res) => {
  Category.updateOne({ _id: req.params.id }, {name: req.body.name})
    .exec(async (err, category) => {

      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_UPDATE_SUCCESS,
        data: category,
        status: config.RES_STATUS_SUCCESS,
      });
    })
};


exports.delete = (req, res) => {
  Category.deleteOne({ _id: req.params.id })
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

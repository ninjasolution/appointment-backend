const db = require("../models");
const service = require("../service");
const User = db.user;
const config = require("../config")

exports.setupFullName = (req, res) => {
  User.findOne({_id: req.userId})
  .exec((err, user) => {

    if (err) {
      res.status(200).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.country = req.body.country;
    user.save(async (err, _user) => {
      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }
  
      return res.status(200).send({
        message: config.RES_MSG_SAVE_SUCCESS,
        data: _user,
        status: config.RES_STATUS_SUCCESS,
      });
    });
  })

  
}


exports.setupBusiness = (req, res) => {
  User.findOne({_id: req.userId})
  .exec((err, user) => {

    if (err) {
      res.status(200).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    user.businessName = req.body.businessName;
    user.businessType = req.body.businessType;
    user.teamSize = req.body.teamSize;
    user.country = req.body.country;
    user.location = req.body.location;
    user.favourSoftwareType = req.body.favourSoftwareType;
    user.whereHear = req.body.whereHear;
    user.website = req.body.website;
    user.save(async (err, _user) => {
      if (err) {
        res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }
  
      return res.status(200).send({
        message: config.RES_MSG_SAVE_SUCCESS,
        data: _user,
        status: config.RES_STATUS_SUCCESS,
      });
    });
  })

  
}


exports.allUsers = (req, res) => {
  User.find()
    .populate('roles')
    .exec((err, users) => {

      if (err) {
        res.status(200).send({ message: err });
        return;
      }

      if (!users) {
        return res.status(404).send({ message: "Orders Not found." });
      }

      return res.status(200).send(users);
    })
};


exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('roles')
    .exec((err, user) => {

      if (err) {
        res.status(200).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "User Not found.", status: config.RES_STATUS_FAIL });
      }

      return res.status(200).send(user);
    })
};

exports.checkVerification = (req, res) => {

  User.findOne({ _id: req.userId })
    .exec(async (err, user) => {

      if (err) {
        return res.status(200).send({ message: err, status: config.RES_STATUS_FAIL });
      }

      if (!user) {
        return res.status(200).send({ message: err, status: config.RES_STATUS_FAIL });
      }

      try {

        return res.status(200).send({ message: {
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified
        }, status: config.RES_STATUS_SUCCESS });
      } catch (err) {
        return res.status(200).send({ message: err, status: config.RES_STATUS_FAIL });
      }

    })
}


exports.update = (req, res) => {
  User.findOne({ _id: req.userId })
    .populate('roles')
    .exec(async (err, user) => {

      if (err) {
        res.status(200).send({ message: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "User Not found.", status: config.RES_STATUS_FAIL });
      }

      user.name = req.body.name;
      user.phoneNumber = req.body.phoneNumber;

      user.save(err => {
        if (err) {
          return res.status(200).send({ message: err, status: config.RES_STATUS_FAIL });
        }
        return res.status(200).json({status: config.RES_STATUS_SUCCESS, data: user});
      });
    })
};

exports.setRole = (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('roles')
    .exec((err, user) => {

      if (err) {
        res.status(500).send({ data: err, status: config.RES_STATUS_FAIL });
        return;
      }

      if (!user) {
        return res.status(404).send({ data: "Orders Not found.", status: config.RES_STATUS_FAIL });
      }

      Role
        .find({ name: req.params.role },
          (err, roles) => {
            if (err) {
              return;
            }
            user.roles = roles.map(role => role._id);
            user.adminType = req.params.type
            user.save(err => {
              if (err) {
                return;
              }
              User.findOne({ _id: user._id })
                .populate('roles')
                .exec((err, fUser) => {
                  if (err) {
                    res.status(500).send({ data: err, status: config.RES_STATUS_FAIL });
                    return;
                  }

                  if (!fUser) {
                    return res.status(404).send({ data: "Orders Not found.", status: config.RES_STATUS_FAIL });
                  }
                  res.status(200).json({ data: fUser, status: config.RES_STATUS_SUCCESS });
                })
            });
          }
        );
    })
};

exports.delete = (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .exec(() => {
      res.status(200).send();

    })
};

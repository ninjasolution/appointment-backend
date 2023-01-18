const db = require("../models");
const service = require("../service");
const User = db.user;
const config = require("../config")


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
        return res.status(200).send({ message: "User Not found.", status: "errors" });
      }

      return res.status(200).send(user);
    })
};

exports.checkVerification = (req, res) => {

  User.findOne({ _id: req.userId })
    .exec(async (err, user) => {

      if (err) {
        return res.status(200).send({ message: err, status: "errors" });
      }

      if (!user) {
        return res.status(200).send({ message: err, status: "errors" });
      }

      try {

        return res.status(200).send({ message: {
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified
        }, status: "success" });
      } catch (err) {
        return res.status(200).send({ message: err, status: "errors" });
      }

    })
}


exports.update = (req, res) => {
  User.findOne({ _id: req.userId })
    .populate('roles')
    .exec(async (err, user) => {

      if (err) {
        res.status(200).send({ message: err, status: "errors" });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "User Not found.", status: "errors" });
      }

      user.name = req.body.name;
      user.phoneNumber = req.body.phoneNumber;

      user.save(err => {
        if (err) {
          return res.status(200).send({ message: err, status: "errors" });
        }
        return res.status(200).json({status: "success", data: user});
      });
    })
};

exports.setRole = (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('roles')
    .exec((err, user) => {

      if (err) {
        res.status(500).send({ data: err, status: "errors" });
        return;
      }

      if (!user) {
        return res.status(404).send({ data: "Orders Not found.", status: "errors" });
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
                    res.status(500).send({ data: err, status: "errors" });
                    return;
                  }

                  if (!fUser) {
                    return res.status(404).send({ data: "Orders Not found.", status: "errors" });
                  }
                  res.status(200).json({ data: fUser, status: "success" });
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

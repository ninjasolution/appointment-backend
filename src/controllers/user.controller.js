const db = require("../models");
const User = db.user;
const Role = db.role;
const config = require("../config")

exports.setupFullName = (req, res) => {
  User.findOne({ _id: req.userId })
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
      user.country = req.body.countryId;
      user.save(async (err, _user) => {
        if (err) {
          res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
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
  User.findOne({ _id: req.userId })
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
          res.status(500).send({ message: err, status: config.RES_STATUS_FAIL });
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

exports.addClient = async (req, res) => {

  const clientRole = await Role.findOne({ name: config.ROLE_CLIENT })
  const client = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    secondPhone: req.body.secondPhone,
    gender: req.body.gender,
    birthDate: req.body.birthDate,
    birthYear: req.body.birthYear,
    info: req.body.info,
    address: req.body.address,
    roles: [clientRole._id]
  })

  client.save((err, _client) => {

    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    User.updateOne({ _id: req.userId }, { $push: { clients: client._id } })
      .exec((err, user) => {

        if (err) {
          res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
          return;
        }

        return res.status(200).send({
          message: config.RES_MSG_SAVE_SUCCESS,
          data: _client,
          status: config.RES_STATUS_SUCCESS
        });
      })
  });
}

exports.addSupplier = async (req, res) => {

  const SupplierRole = await Role.findOne({ name: config.ROLE_SUPPLIER })
  const supplier = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    info: req.body.info,
    roles: [SupplierRole._id]
  })

  supplier.save((err, _supplier) => {

    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    User.updateOne({ _id: req.userId }, { $push: { suppliers: _supplier._id } })
      .exec((err, user) => {

        if (err) {
          res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
          return;
        }

        return res.status(200).send({
          message: config.RES_MSG_SAVE_SUCCESS,
          data: _supplier,
          status: config.RES_STATUS_SUCCESS
        });
      })
  });
}

exports.addMember = async (req, res) => {

  const memberRole = await Role.findOne({ name: config.ROLE_MEMBER })
  const client = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar,
    email: req.body.email,
    phone: req.body.phone,
    info: req.body.info,
    employment: req.body.employment,
    enableBooking: req.body.enableBooking,
    services: req.body.services,
    commission: req.body.commission,
    permission: req.body.permission,
    roles: [memberRole._id]
  })

  client.save((err, _client) => {

    if (err) {
      res.status(400).send({ message: err, status: config.RES_STATUS_FAIL });
      return;
    }

    User.updateOne({ _id: req.userId }, { $push: { clients: client._id } })
      .exec((err, user) => {

        if (err) {
          res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
          return;
        }

        return res.status(200).send({
          message: config.RES_MSG_SAVE_SUCCESS,
          data: _client,
          status: config.RES_STATUS_SUCCESS
        });
      })
  });
}

exports.getAllMember = (req, res) => {
  User.findOne({ _id: req.userId })
    .populate('members', "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: user.members,
        status: config.RES_STATUS_SUCCESS
      });
    })
}

exports.getAllClients = (req, res) => {
  User.findOne({ _id: req.userId })
    .populate('clients', "-__v")
    .exec((err, user) => {
      if (err) {
        console.log(err)
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: user.clients,
        status: config.RES_STATUS_SUCCESS
      });
    })
}

exports.getAllSuppliers = (req, res) => {
  User.findOne({ _id: req.userId })
    .populate('suppliers', "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err, status: config.RES_MSG_UPDATE_FAIL });
        return;
      }

      return res.status(200).send({
        message: config.RES_MSG_DATA_FOUND,
        data: user.suppliers,
        status: config.RES_STATUS_SUCCESS
      });
    })
}


exports.allUsers = (req, res) => {
  User.find()
    .populate('roles', "-__v -users")
    .exec((err, users) => {

      if (err) {
        res.status(200).send({ message: err });
        return;
      }

      if (!users) {
        return res.status(404).send({ message: "Users Not found." });
      }

      return res.status(200).send(users);
    })
};


exports.getById = (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('roles', "-__v -users")
    .populate('services', "-__v")
    .populate('clients', "-__v")
    .populate('members', "-__v")
    .populate('suppliers', "-__v")
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

        return res.status(200).send({
          message: {
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified
          }, status: config.RES_STATUS_SUCCESS
        });
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
        return res.status(200).json({ status: config.RES_STATUS_SUCCESS, data: user });
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
        return res.status(404).send({ data: "Role Not found.", status: config.RES_STATUS_FAIL });
      }

      Role
        .find({ name: req.body.role },
          (err, roles) => {
            if (err) {
              return;
            }
            user.roles = roles.map(role => role._id);
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

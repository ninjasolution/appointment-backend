const jwt = require("jsonwebtoken");
const auth = require("../config/auth.config");
const config = require("../config/index");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(200).send({ message: "No token provided!", status: "errors" });
  }

  jwt.verify(token, auth.secret, (err, decoded) => {
    if (err) {
      return res.status(200).send({ message: "Unauthorized!", status: "errors" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(200).send({ message: err, status: "errors" });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(200).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === config.ROLE_ADMIN) {
            next();
            return;
          }
        }

        res.status(200).send({ message: "Require Admin Role!", status: "errors" });
        return;
      }
    );
  });
};

const isUser = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(200).send({ message: err, status: "errors" });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(200).send({ message: err, status: "errors" });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === config.ROLE_USER) {
            next();
            return;
          }
        }

        res.status(200).send({ message: "Require user Role!", status: "errors" });
        return;
      }
    );
  });
};


const authJwt = {
  verifyToken,
  isAdmin,
  isUser
};
module.exports = authJwt;

const db = require("../models");
const User = db.user;
const Role = db.role;
const authConfig = require("../config/auth.config");
const config = require("../config/index")
const Token = db.token;
const twilio = require('twilio');
const promisify = require('util.promisify');
const nodemailer = require("nodemailer");
const crypto = require("crypto")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require('axios').default;


exports.signup = async (req, res) => {


  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  if (req.body.roles) {
    Role.find({ name: { $in: req.body.roles } }, (err, roles) => {
      if (err) {
        return res.status(200).send({ message: err, status: "errors" });
      }

      user.roles = roles.map(role => role._id);
      user.save(err => {
        if (err) {
          return res.status(200).send({ message: err, status: "errors" });
        }

        res.send(user);
      });
    }
    );
  } else {
    Role.findOne({ name: config.ROLE_USER }, (err, role) => {
      if (err) {
        return res.status(200).send({ message: "Role doesn't exist.", status: "errors" });

      }

      user.roles = [role._id];
      user.save(async (err, nUser) => {
        if (err) {
          return res.status(200).send({ message: `E11000 duplicate key error collection: users index: email_1 dup key: { email: ${req.body.email}}`, status: "errors" });

        }

        let token = await new Token({
          user: nUser._id,
          type: config.TOKEN_TYPE_EMAIL,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();


        try {
          const message = `<p>You requested for email verification, kindly use this <a href="${process.env.BASE_URL}/#/auth/verify/${user._id}/${token.token}" target="_blank">link</a> to verify your email address</p>`
          await sendEmail(nUser.email, "Verify Email", message);
  
        } catch (err) {
          return res.status(200).send({ message: "Bot API doesn't work", status: "errors" });
        }

        nUser.authCode = "1ee9394573062b6dbe275d9c570d52f4";

        nUser.save(async (err, rUser) => {
          if (err) {
            res.status(200).send({ message: err, status: "errors" });
            return;
          }

          var token = jwt.sign({ id: rUser._id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
          });

          return res.status(200).send({
            message: "success",
            token,
            status: "success",
          });
        });
      });
    });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(200).send({ message: err, status: "errors" });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "Incorrect id or password", status: "errors" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({ message: "Incorrect id or password", status: "errors" });
      }

      var token = jwt.sign({ id: user._id }, authConfig.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        status: "success",
        token,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          changePasswordAt: user.changePasswordAt,
          passwordtoken: user.resetPasswordToken,
          passwordtokenexp: user.resetPasswordExpires,
          roles: user.roles,
        }
      });
    });
};

exports.verifyEmail = async (req, res) => {
  try {
    User.findOne({
      _id: req.params.id
    })
      .populate("tokens", "-__v")
      .exec(async (err, user) => {
        if (!user) return res.status(200).send({ message: "Not exist user", status: "errors" });
        if (user.emailVerified) {
          var token = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
          });
          return res.status(200).send({
            status: "success",
            token,
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
              emailVerified: user.emailVerified,
              phoneVerified: user.phoneVerified,
              changePasswordAt: user.changePasswordAt,
              passwordtoken: user.resetPasswordToken,
              passwordtokenexp: user.resetPasswordExpires,
              roles: user.roles,
            }
          });
        }

        const tokens = await Token.find({
          user: req.params.id,
          type: config.TOKEN_TYPE_EMAIL,
        });
        if (tokens.length === 0) return res.status(200).send({ message: "Token doesn't exist", status: "errors" });
        if (!tokens.map(t => t.token).includes(req.params.token)) {
          return res.status(200).send({ message: "Incorrect token", status: "errors" });
        }

        await User.updateOne({ _id: user._id }, { emailVerified: true });
        await Token.deleteMany({ _id: { $in: tokens.map(t => t._id) } });

        var token = jwt.sign({ id: user._id }, authConfig.secret, {
          expiresIn: 86400 // 24 hours
        });

        return res.status(200).send({
          status: "success",
          token,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            changePasswordAt: user.changePasswordAt,
            passwordtoken: user.resetPasswordToken,
            passwordtokenexp: user.resetPasswordExpires,
            roles: user.roles,
          }
        });
      })


  } catch (error) {
    res.status(200).send({ message: "An error occured", status: "errors" });
  }
}

exports.verifyPhoneNumber = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) return res.status(200).send({ message: "An error occured", status: "errors" });
    if (user.phoneVerified) return res.send({ message: "phone verified sucessfully", status: "success" });

    const token = await Token.findOne({
      user: user._id,
      type: config.TOKEN_TYPE_SMS,
      token: req.params.token,
    });
    if (!token) return res.status(200).send({ message: "An error occured", status: "errors" });

    await User.updateOne({ _id: user._id, phoneVerified: true });
    await Token.findByIdAndRemove(token._id);

    res.send({ message: "phone verified sucessfully", status: "success" });
  } catch (error) {
    res.status(200).send({ message: "An error occured", status: "errors" });
  }
}

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!",
      status: "success"
    });
  } catch (err) {
    res.status(200).send({ message: "An error occured", status: "errors" });
  }
};

exports.forgot = async (req, res, next) => {
  const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
  User.findOne({ email: req.body.email }, {}, async function (err, user) {
    if (err) {
      return res.status(200).send({ message: err, status: "errors" });
    }
    if (!user) {
      return res.status(200).send({ message: "There is no user with this email", status: "errors" });
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    const message = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        <a href="http://${req.headers.host}/reset/${token}" target="_blank">link</a>
        If you did not request this, please ignore this email and your password will remain unchanged.</p>`

    try {
      await sendEmail(user.email, "Reset Password", message)

      return res.status(200).send({ resettoken: token, status: "success" });
    } catch {
      return res.status(200).send({ message: "There is no user with this email.", status: "errors" });
    }
  })
}

exports.reset = async (req, res) => {
  User.findOne({
    _id: req.userId
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(200).send({ message: "Incorrect id or password", status: "errors" });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "Incorrect id or password", status: "errors" });
      }

      if (!(user.resetPasswordExpires > Date.now()) && crypto.timingSafeEqual(Buffer.from(user.resetPasswordToken), Buffer.from(req.params.token))) {
        return res.status(200).send({ message: "Password reset token is invalid or has expired." });
      }

      user.password = req.body.password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = 0;

      user.save(async (err, rUser) => {
        if (err) {
          res.status(200).send({ message: err, status: "errors" });
          return;
        }
        const message = `<p>This is a confirmation that the password for your account "${user.email}" has just been changed. </p>`

        await sendEmail(user.email, "Reset Password", message)
        return res.send({ message: `Success! Your password has been changed.`, status: "errors" });

      });
    })
}

exports.changePassword = (req, res) => {
  User.findOne({
    _id: req.userId
  })
    .exec((err, user) => {
      if (err) {
        res.status(200).send({ message: err, status: "errors" });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "Incorrect id or password", status: "errors" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({ message: "Incorrect id or password", status: "errors" });
      }

      user.password = req.body.newPassword;
      user.changePasswordAt = Date.now();

      user.save(async (err, rUser) => {
        if (err) {
          res.status(200).send({ message: err, status: "errors" });
          return;
        }

        return res.status(200).send({
          status: "success",
          data: "Password is reseted!"
        });
      })
    });
};

exports.requestEmailVerify = (req, res) => {
  User.findOne({
    _id: req.userId
  })
    .exec(async (err, user) => {
      if (err) {
        res.status(200).send({ message: err, status: "errors" });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "Not exist user", status: "errors" });
      }

      let token = await new Token({
        user: user._id,
        type: config.TOKEN_TYPE_EMAIL,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const message = `<p>You requested for email verification, kindly use this <a href="${process.env.BASE_URL}/#/auth/verify/${user._id}/${token.token}" target="_blank">link</a> to verify your email address</p>`
      await sendEmail(user.email, "Verify Email", message);

      return res.status(200).send({ message: "Sucess", status: "success" });
    })
}

exports.requestPhoneVerify = (req, res) => {
  User.findOne({
    _id: req.userId
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(200).send({ message: err, status: "errors" });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "Incorrect token", status: "errors" });
      }

      await sendSMS(user);
      return res.status(200).send({ message: "Sucess", status: "success" });
    })
}

const sendEmail = async (email, subject, html) => {

  try {

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      },
      port: 465
    })

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html
    })
  } catch {
    return console.log("SMTP server error");
  }

}

const sendSMS = async (user) => {
  try {
    const client = new twilio(process.env.SMS_ID, process.env.SMS_TOKEN);
    const code = getRandomInt(100000, 999999)

    await new Token({
      user: user._id,
      type: config.TOKEN_TYPE_SMS,
      token: code,
    }).save();

    await client.messages
      .create({
        body: `Mr-Tradly security code: ${code}`,
        to: user.phoneNumber, // Text this number
        from: process.env.PHONE_NUMBER, // From a valid Twilio number
      })

  } catch {
    return console.log("SMS server error");
  }

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

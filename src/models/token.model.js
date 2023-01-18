const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const config = require("../config/index")

module.exports = (connection, autoIncrement) => {

  const TokenSchema = new mongoose.Schema({
    user: {
      type: Number,
      ref: "User",
    },
    type: {
      type: String,
      enum: [config.TOKEN_TYPE_SMS, config.TOKEN_TYPE_EMAIL],
    },
    token:  {
      type: String,
      require: true
    }
  });
  TokenSchema.plugin(autoIncrement.plugin, "Token")
  TokenSchema.plugin(timestamps);

  const Token = connection.model(
    "Token",
    TokenSchema
  );
  return Token;
}

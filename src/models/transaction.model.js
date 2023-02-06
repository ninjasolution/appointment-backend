const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');


module.exports = (connection, autoIncrement) => {

  const TransactionSchema = new mongoose.Schema({
    product: {
      type: Number,
      ref: "Product"
    },
    service: {
      type: Number,
      ref: "Service"
    },
    membership: {
      type: Number,
      ref: "Membership"
    },
    voucher: {
      type: Number,
      ref: "Voucher"
    },
    tip: {
      type: Number
    },
    payment: [{
      type: Object
    }],
    status: {
      type: Number,
      default: 0
    },
    user: {
      type: Number,
      ref: "User"
    },
    client: {
      type: Number,
      ref: "User"
    }
  });
  
  TransactionSchema.plugin(autoIncrement.plugin, "Transaction")
  TransactionSchema.plugin(timestamps);
  TransactionSchema.plugin(mongoosePaginate);

  const Transaction = connection.model(
    "Transaction",
    TransactionSchema
  );
  return Transaction;
}

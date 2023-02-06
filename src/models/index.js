const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const autoIncrement = require('mongoose-auto-increment');

const db = {};

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

db.mongoose = mongoose;
db.connection = db.mongoose.createConnection(`mongodb://unvmrczl9nmvrtrvrjlb:lVMEdLKdhzLEPgLik1Z1@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bybyaysdyybmbws?replicaSet=rs0`)
// db.connection = db.mongoose.createConnection(`mongodb://127.0.0.1:27017/fresha`)
autoIncrement.initialize(db.connection);

db.currency = require("./currency.model")(db.connection, autoIncrement);
db.treatment = require("./treatment.model")(db.connection, autoIncrement);
db.brand = require("./brand.model")(db.connection, autoIncrement);
db.measure = require("./measure.model")(db.connection, autoIncrement);
db.role = require("./role.model")(db.connection, autoIncrement);
db.user = require("./user.model")(db.connection, autoIncrement);
db.token = require("./token.model")(db.connection, autoIncrement);
db.categoryType = require("./categoryType.model")(db.connection, autoIncrement);
db.tax = require("./tax.model")(db.connection, autoIncrement);
db.tip = require("./tip.model")(db.connection, autoIncrement);
db.category = require("./category.model")(db.connection, autoIncrement);
db.product = require("./product.model")(db.connection, autoIncrement);
db.transaction = require("./transaction.model")(db.connection, autoIncrement);
db.membership = require("./membership.model")(db.connection, autoIncrement);
db.service = require("./service.model")(db.connection, autoIncrement);
db.appointment = require("./appointment.model")(db.connection, autoIncrement);
db.appointmentItem = require("./appointmentItem.model")(db.connection, autoIncrement);
db.voucher = require("./voucher.model")(db.connection, autoIncrement);
db.country = require("./country.model")(db.connection, autoIncrement);
db.order = require("./order.model")(db.connection, autoIncrement);
db.cart = require("./cart.model")(db.connection, autoIncrement);
db.ROLES = ["user", "supplier", "client", "member"];

module.exports = db;
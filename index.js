const express = require("express");
var path = require('path');
const cors = require("cors");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require("bcryptjs");
const indexRouter = require("./src/routes");

const { secret } = require("./src/config/auth.config")
const config = require("./src/config/index")
const source = require("./src/config/source")

require('dotenv').config(); 

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: secret,
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.set("view engine", "ejs")
var allowedOrigins = ['http://localhost:3000',
                      'http://yourapp.com'];
// app.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     console.log(origin)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method == 'OPTIONS') {
      res.status(200).end()
      return;
  }
  // Pass to next layer of middleware
  next();
});

app.use('/api', indexRouter); 

app.get("/check", (req, res) => {
  return res.send("Welcome!");
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') == 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

const db = require("./src/models");
const Role = db.role;
const Country = db.country;
const Currency = db.currency;
const CategoryType = db.categoryType;
const User = db.user;
db.connection.on("open", () => {
  console.log("Successfully connect to MongoDB.");
  initial();
})
db.connection.on("error", (err) => {
  console.error("Connection error", err);
  process.exit();
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


function initial() {
  Role.estimatedDocumentCount(async (err, count) => {
    if (!err && count == 0) {

      for(let i=0 ; i<source.roles.length ; i++) {
        const role = new Role({ name: source.roles[i]});
        await role.save();  
      }

      const role = await Role.findOne({name: config.ROLE_ADMIN});
      const adminUser = new User({
        firstName: "Ninja",
        lastName: "Cooler",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("111", 8),
        roles: [role._id]
      })

      adminUser.save((err, admin) => {
        if (err) {
          return console.log(err);
        }
        console.log(admin)
      });
    }
  });

  Country.estimatedDocumentCount(async (err, count) => {
    if (!err && count == 0) {

      source.countries.forEach(async item => {
        const country = new Country({ 
            name: item.name, 
            code: item.code, 
            timezone: item.timezone, 
            utc: item.utc, 
            mobileCode: item.mobileCode, 
          });
        await country.save();  
      })
    }
  });

  CategoryType.estimatedDocumentCount(async (err, count) => {
    if (!err && count == 0) {

      source.categoryType.forEach(async item => {
        const cateType = new CategoryType({ 
            name: item, 
          });
        await cateType.save();  
      })
    }
  });

  Currency.estimatedDocumentCount(async (err, count) => {
    if (!err && count == 0) {

      source.currencies.forEach(async item => {
        const currency = new Currency({ 
            name: item, 
          });
        await currency.save();  
      })
    }
  });
}

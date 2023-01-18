const express = require("express");
var path = require('path');
const cors = require("cors");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const passport    = require('passport');
const session = require('express-session');
const bcrypt = require("bcryptjs");

const indexRouter = require("./src/routes");

const { secret } = require("./src/config/auth.config")
const config = require("./src/config/index")

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
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count == 0) {
      new Role({
        name: config.ROLE_USER
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
      });

      new Role({
        name: config.ROLE_ADMIN
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

          const adminUser = new User({
            name: "ninja cooler",
            email: "admin@gmail.com",
            password: bcrypt.hashSync("admin", 8)
          })
          Role.find({name: config.ROLE_USER}, (err, roles) => {
              if (err) {
                return;
              }
      
              adminUser.roles = roles.map(role => role._id);
              adminUser.save(err => {
                if (err) {
                  return console.log(err);
                }

                console.log("Database is initialized successfuly!")
              });
          });
        
      });
    }
  });
}

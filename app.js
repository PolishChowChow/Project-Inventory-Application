require("dotenv").config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose")
const logger = require('morgan');

const shopRouter = require('./routes/shop')
const indexRouter = require('./routes/index');
const panelRouter = require('./routes/panel');
const session = require("express-session");
const passport = require("passport");

async function connection(){
  await mongoose.connect(process.env.URL || "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1",{
    dbName: "inventory"
  })
  console.log("connected to db")
}
connection().catch(err => console.log(err))

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
  secret: "test",
  resave: "false",
}))
app.use(passport.initialize())
app.use(passport.session({
  saveUninitialized: false
}))


app.use('/', indexRouter);
app.use('/panel', panelRouter);
app.use('/shop', shopRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

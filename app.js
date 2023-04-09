//var createError = require('http-errors');
var express = require('express');
const { engine } = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var hbs=require('hbs');
var path=require('path');
var app = express();
const cookieParser = require("cookie-parser");
var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');
app.use('/', indexRouter);
app.get('/', indexRouter, (req, res) => res.render('home'));
app.use(cookieParser());

app.use('/api', apiRouter);

app.set('view engine', 'hbs');
app.set("views", "./views");


app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
      sum: (a, b) => a + b
  }
}));

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

// var cors = require('cors')

// app.use(cors());
// dùng file trong parital
app.use(passport.initialize());
const parital=path.join(__dirname,"views/partials")
hbs.registerPartials(parital);
// dùng css tron pblic 
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 - Khong tim thay trang')
  next();
});


module.exports = app;

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

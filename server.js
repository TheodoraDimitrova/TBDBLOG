const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const $ = require('jquery');
const session = require('express-session');
const expressValidator = require('express-validator');
const hbs = require('express-handlebars');
const passport = require('passport');

const app = express();
app.use(expressValidator());

// Passport Config
require('./config/passport')(passport);

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session
app.use(
  session({
    secret: require('./config/keys').secretOrKey,
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Register Handlebars view engine
app.engine(
  '.hbs',
  hbs({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: [__dirname + '/views/partials']
  })
);
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));

//Connection to DB
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(() => {
    err => console.log(err);
  });

// Global variables
app.use(function(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.is_admin = req.user.role === 'Admin' ? true : false;
  }
  next();
});

//Express Messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/articles', require('./routes/articles'));
app.use('/manage', require('./routes/manage'));
app.use('/categories', require('./routes/categories'));
app.use('/users', require('./routes/users'));
app.use('/questions', require('./routes/questions'));

//Start server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server starts at port ${port}`);
});

const express = require('express');
const path = require('path');
const morgan = require("morgan");
const mongoose = require('mongoose');
const $ = require('jquery');
const session = require('express-session');
const expressValidator = require('express-validator');
const hbs = require('express-handlebars');

const passport = require('passport');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const PORT = process.env.PORT || 8000;

const app = express();
// Add Access Control Allow Origin headers
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use(expressValidator());

// Passport Config
require('./config/passport')(passport);

//Body parser middleware
app.use(express.urlencoded({extended:false}))

app.use(morgan("dev")); 

app.use(express.json())

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
    hbs: allowInsecurePrototypeAccess(hbs),
    extname: '.hbs',
    partialsDir: [__dirname + '/views/partials',],
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);

app.set('view engine', 'hbs');
// app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));

//Connection to DB
const db = require('./config/keys').MONGO_URI;
const connnectDB = async () => {
  try {
      const conn = await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (err) {
      console.error(err);
      process.exit(1)
  }
}
connnectDB()

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
app.set("port",PORT)

app.listen(PORT, () => {

  console.log(`Server starts at port ${PORT}`);
  
});

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const loginRouter = require('./routes/login');
const indexRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const orcamentoRouter = require('./routes/orcamento');

const authMiddleware = require('./middlewares/authMiddleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const permissions = require('./middlewares/permissionMiddleware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

authMiddleware(passport);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutes
  // Use MongoDB for session storage
  store: new MongoStore({
    mongoUrl: process.env.DATABASE_CONNECTION, // mongoUrl
    dbName: 'sessions', // dbName
    autoRemove: 'native', // Automatically remove expired sessions
    ttl: 30 *60 // 30 minutes
  })
}));

app.use(passport.session());  
app.use(passport.initialize());

app.use('/', loginRouter);
app.use('/login', loginRouter);
app.use('/home', indexRouter);
app.use('/users', permissions, usersRouter);
app.use('/orcamento', permissions, orcamentoRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const dotenv = require('dotenv');
dotenv.config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

//routes
const loginRouter = require('./routes/login');
const indexRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const orcamentoRouter = require('./routes/orcamento');

const authMiddleware = require('./middlewares/authMiddleware');
const permissionMiddleware = require('./middlewares/permissionMiddleware');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient } = require('mongodb');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(process.env.DATABASE_CONNECTION);
console.log(process.env.SESSION_SECRET);

authMiddleware(passport); // Passport configuration. O middleware deve ser configurado antes da sessão. Ele espera um objeto passport como argumento.

// usamos uma sessão para manter o estado de autenticação do usuário entre as requisições.
// A sessão será armazenada no MongoDB para persistência. Mesmo que o servidor reinicie, a sessão do usuário permanecerá ativa até expirar.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // não salva a sessão se nada foi modificado
    saveUninitialized: false, // não cria uma sessão até que algo seja armazenado nela. Util para evitar sessões vazias e quando há áreas públicas (nao autenticadas) no site.
    cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutos
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_CONNECTION,
      dbName: 'sessions',
      autoRemove: 'native',
      ttl: 30 * 60 // 30 minutos
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/',  indexRouter);
app.use('/home',  indexRouter);
app.use('/login', loginRouter);
app.use('/users', permissionMiddleware, usersRouter);
app.use('/orcamento', permissionMiddleware, orcamentoRouter);

// // Inicie seu servidor aqui
// app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
//   console.log('Servidor rodando na porta 3000 via ipv4');
// });

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

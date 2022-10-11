var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');
var redisClient = redis.createClient();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new RedisStore({
    client: redisClient, // client redis
    host: 'test-redis.7eqnvn.ng.0001.apn2.cache.amazonaws.com',
    port: 6379 // Redis port 번호
  }),
  secret: '!@#$%$@#', // Secret Key는 아무거나 입력하시면 됩니다.
  resave: true, // 요청때 세션이 수정된게 없으면 강제로 세션 저장
  saveUninitialized: true, // 저장된게 없으면 세션을 저장
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false, // 안전한 상태에서만 쿠키를 보내겠습니다. (https 에서만 보내겠다는 뜻)
    maxAge: 1000 * 60 * 60 * 24 * 30 // 쿠키 저장되는 만료기간 (단위 * 초 * 분 * 시 * 일)
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

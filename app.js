var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('config');
var fs = require('fs');
var cors = require('cors')
var app = express();

const usersRoute = require('./routes/users');
const principalRoute = require('./routes/principal');
const notificationsRoute = require('./routes/notifications');
const paperRoute = require('./routes/questionPaper');
const meetingRoute = require('./routes/meetingCreating');
const leaveRoute = require('./routes/leave');
const forumCreationRoute = require('./routes/forum_creation');
const forumCommentRoute = require('./routes/forum_comments');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/workflow',
  { useNewUrlParser: true })
  .then(() => console.log('MongoDb successsFully Connected!!'))
  .catch(err => console.log('Errror in connecting mongodb', err))
  ;



app.use(logger('common', {
  stream: fs.createWriteStream('./access.log')
}));

app.use('/uploads/', express.static('uploads'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());




app.use('/users', usersRoute);
app.use('/principal', principalRoute);
app.use('/notifications', notificationsRoute);
app.use('/meeting', meetingRoute);
app.use('/paper', paperRoute);
app.use('/leave', leaveRoute);
app.use('/forum', forumCreationRoute);
app.use('/comment', forumCommentRoute);






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  res.send('404 Error caught');
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {



  };

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

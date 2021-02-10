const express = require('express');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const morgan = require('morgan');
const app = express();

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

//To handle unhandled routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Could not find ${req.originalUrl} on this server`,
  // });
  const err = new Error(`Could not find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

//global error handling middleware
app.use((err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

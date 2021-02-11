const express = require('express');
const globalErrorHandler = require('./Controllers/errorController');
const appError = require('./utils/appError');
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
  const err = new appError(
    `Could not find ${req.originalUrl} on this server`,
    404
  );

  next(err);
});

//global error handling middleware
app.use(globalErrorHandler);

module.exports = app;

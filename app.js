const express = require('express');
const globalErrorHandler = require('./Controllers/errorController');
const appError = require('./utils/appError');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const MongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

//Set security http headers
app.use(helmet());

//deveelpmnet logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//to implement number of reuests a client can make to a server.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again after an hour.',
});
app.use('/api', limiter);

//body parsisng, reading data from req.body
app.use(express.json({ limit: '10kb' }));

//data sanitization against nosql injections
app.use(MongoSanitize());

//data sanitization against xss
app.use(xss());

//prevent http parameter pollution.
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//serve static files
app.use(express.static(`${__dirname}/public`));

//route handlers
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

const Tour = require('../Models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug: slug }).populate({
    path: 'reviews',
    field: 'review rating user',
  });
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .render('tour', {
      title: tour.name,
      tour: tour,
    });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log Into Your Account',
  });
});

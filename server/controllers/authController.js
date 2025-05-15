const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc     Login user
// @route    POST /api/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    console.log('User found:', user.email);
    console.log('Stored hashed password:', user.password);
    console.log('Entered password:', password);

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc Register new admin
// @route POST /api/auth/register
// @access Public or restricted
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email, and password', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Email already in use', 400));
  }

  const user = await User.create({ name, email, password });
  sendTokenResponse(user, 201, res);
});

// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Get the raw env variable string
  const rawExpire = process.env.JWT_COOKIE_EXPIRE;

  // Parse to integer (base 10)
  const expireDays = parseInt(rawExpire, 10);

  // Validate the parsed number or fallback to 7 days
  const days = Number.isNaN(expireDays) ? 7 : expireDays;

  // Calculate expiration date
  const expiresDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  // Log for debugging (remove in production)
  console.log(`JWT_COOKIE_EXPIRE: ${rawExpire}, parsed days: ${days}, expires: ${expiresDate}`);

  // Defensive check for valid date
  if (isNaN(expiresDate.getTime())) {
    throw new Error('Invalid cookie expiration date');
  }

  const options = {
    expires: expiresDate,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
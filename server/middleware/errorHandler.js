const ErorrResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err};
    error.message = err.message;

    // Log to console for dev
    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = new ErorrResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        erorr = new ErorrResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidatorErorr') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErorrResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
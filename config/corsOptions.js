const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        // callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    // origin: 'http://localhost:3000',
};

module.exports = corsOptions;

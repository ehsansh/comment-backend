const verifyJWT = require('./middleware/verifyJWT');
module.exports = app => {
    app.use('/api/comments', verifyJWT, require('./routes/comments'));
    app.use('/api/user', require('./routes/user'));
};

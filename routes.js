module.exports = app => {
    // app.use('/api/register', require('./routes/register'));
    app.use('/api/comments', require('./routes/comments'));
};

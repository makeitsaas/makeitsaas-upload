module.exports = (req, res, next) => {
    console.log('auth-middleware mock');
    next();
};

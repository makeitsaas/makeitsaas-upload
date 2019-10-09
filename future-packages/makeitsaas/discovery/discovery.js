let discoveryMap = {};

module.exports = {
    register() {
        // pushes port and host to auth service
    },
    middleware: (req, res, next) => {
        // middleware that refreshes discovery file if necessary
        console.log('discovery-middleware mock');
        next();
    }
};

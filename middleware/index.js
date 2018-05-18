var middleware = {};

middleware.isLoggedIn = (req,res,next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/");
    }
};

module.exports = middleware;
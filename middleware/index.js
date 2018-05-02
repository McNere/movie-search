var middleware = {};

middleware.isLoggedIn = function(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/");
    }
}

module.exports = middleware;
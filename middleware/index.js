var middleware = {};
var User = require("../models/user");
var Movie = require("../models/movie");

middleware.isLoggedIn = function(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/");
    }
};

//logs movie to database if it doesn't already exist
middleware.logMovie = function(req,res,next) {
    Movie.findOne({imdbId: req.body.imdbId}, function(err, foundMovie) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else if (!foundMovie) {
            var movieObj = {
                title: req.body.title,
                imdbId: req.body.imdbId,
                usersLiked: [req.user]
            };
            Movie.create(movieObj, function(err) {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    })
};

module.exports = middleware;
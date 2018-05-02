var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js")

//USER LOGIN AND REGISTER
router.get("/login", function(req,res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req,res){})

router.get("/register", function(req,res) {
    res.render("register");
});

router.post("/register", function(req,res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    });
});

router.get("/logout", function(req,res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
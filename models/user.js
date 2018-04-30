var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var movie = require("./movie.js");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	movies: [movie.schema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
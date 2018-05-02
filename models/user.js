var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	likedMovies: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie"
		},
		title: String
	}]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
	imdbId: String,
	title: String,
	year: String,
	usersLiked: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}]
});

module.exports = mongoose.model("Movie", movieSchema);
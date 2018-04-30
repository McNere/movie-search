var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
	imdbId: String,
	title: String,
	year: String
});

module.exports = mongoose.model("Movie", movieSchema);
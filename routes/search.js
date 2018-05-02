var express = require("express");
var router = express.Router();
var request = require("request");
var bodyParser = require("body-parser");

router.get("/search", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?s=" + req.query.title + "&apikey=" + process.env.APIKEY;
    request(searchTerm, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            res.render("search/result", {dataObj: data});
        }
        else console.log(error);
    });
});

router.get("/search/:id", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?i=" + req.params.id + "&apikey=" + process.env.APIKEY;
    request(searchTerm, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            var data = JSON.parse(body);
            console.log(data);
            res.render("search/movie", {dataObj: data});
        }
        else console.log(err);
    });
});

module.exports = router;
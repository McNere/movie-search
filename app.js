var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var app = express();
var data = {};
var plot= {};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res) {
    res.render("home");
    console.log("Visited");
});

app.get("/search", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?s=" + req.query.title + "&apikey=" + process.env.APIKEY;
    request(searchTerm, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            res.render("result", {dataObj: data});
        }
        else console.log(error);
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running");
});
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var PORT = 3000;

// Requiring the `News` model for accessing the `News` collection
var News = require("./newsModel.js");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsdb");

// Routes

// Route to post our form submission to mongoDB via mongoose
// app.post("/submit", function (req, res) {
// 	// Create a new user using req.body

// 	var user = new User(req.body);
// 	user.setFullName();
// 	user.lastUpdatedDate();

// 	User.create(user)
// 		.then(function (dbUser) {
// 			// If saved successfully, send the the new User document to the client
// 			res.json(dbUser);
// 		})
// 		.catch(function (err) {
// 			// If an error occurs, send the error to the client
// 			res.json(err);
// 		});
// });

// Start the server
app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});

app.post("/getnews", function (req, res) {
	// Save the request body as an object called book
	// console.log(req);
	var weburl = "https://www.npr.org/sections/" + req.body.category + "/";
	console.log(weburl);

	request(weburl, function (error, response, html) {

		var $ = cheerio.load(html);
		var results = [];

		$('.title').each(function (i, element) {
			var headline = $(element).text();
			var url = $(element).children().attr("href");

			if (!headline.includes("\n")) {
				results.push({
					headline: headline
					, url: url
				});
				// db.scrapedData.insert({
				// 	title: title
				// 	, link: link
				// })
			}
		});

		console.log(results);
		res.json(results);
	});
});


app.post("/savenews", function (req, res) {
	console.log(req.body.headline, req.body.url, req.body.category);

	var news = new News(req.body);
	console.log(news);
	News.create(news)
		.then(function (dbNews) {
			// If saved successfully, send the the new User document to the client
			res.json(true);
		})
		.catch(function (err) {
			// If an error occurs, send the error to the client
			res.json(err);
		});

});

app.get("/savednews", function (req, res) {
	News.find( function (error, found) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);
		}
	});
});

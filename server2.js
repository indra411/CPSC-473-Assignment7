var require;
var express = require("express"),
	http = require("http"),
	// import the mongooese library
	mongoose = require("mongoose"),
	app = express();

var bodyParser = require("body-parser");

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// connect to assignment7 data stored in mongoose
mongoose.connect('mongodb://localhost/assignment7');

// mongoose model for storing links
var LinkSchema = mongoose.Schema({
	"title" : String,
	"link" : String,
	"clicks" : Number
});

var Link = mongoose.model("Link", LinkSchema);

// Express powered HTTP Server
http.createServer(app).listen(3000);

app.get("/links", function (req, res) {
	Link.find({}, function (err, links) {
		res.json(links);
	});
});

app.post("/links", function (req, res) {
	console.log(req.body);
	var newLink = new Link({"title": req.body.title,
							"link": req.body.link,
							"clicks": req.body.clicks});
	newLink.save(function (err, result) {
		if(err !== null) {
			console.log(err);
			res.send("ERROR");
		} else {
			Link.find({}, function (err,result) {
				if (err!== null) {
					//didn't get saved!
					res.send("ERROR");
				}
				res.json(result);
			});
		}
	});
});

app.get("/click/:title", function (req, res) {
	console.log("the url param is = " + req.params.title);
	var linkTitle = req.params.title;

	Link.findOne({"title":linkTitle}, function (err, theLink) {
		
		console.log("theLink.link = " + theLink.link);

		if(err !== null) {
			console.log(err);
			res.send("ERROR incrementing clicks..");
		} 
		else {
			theLink.clicks = theLink.clicks + 1;

			theLink.save(function (err) {
				if(err) {
					console.log(err);
				}

			});

			// Redirect to the URL
			res.redirect(theLink.link);
		}
	});
});
/*
Indrawan Saputra (indrawan@csu.fullerton.edu)
CPSC 473-01 Assignment 6
4/11/2016
*/
var require, response;
var express = require("express"),
    http = require("http"),
    app;

var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

// Express powered HTTP Server
app = express();
http.createServer(app).listen(3000);

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var redis = require("redis"),
    client = redis.createClient(),
    $coinFlips = {};

$coinFlips.wins = 0;
$coinFlips.losses = 0;

app.get("/hello", function(req, res) {
    res.send("hello world!");
});


app.post("/flip", urlencodedParser, function(req, res) {
    var coin = ["heads", "tails"];

    var randomNum = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    console.log(randomNum);
    console.log(req.body);
    console.log(req.body.call);

    if (req.body.call == coin[randomNum]) {
        client.incr("wins"); //incrementing wins

        console.log("Matched - you win");
        response = {
            "result": "win"
        };
        console.log(response);
        res.json(response);
    } else {
        client.incr("losses");

        console.log("It doesn't match - you loss");
        response = {
            "result": "loss"
        };
        console.log(response);
        res.json(response);
    }
});

app.get("/stats", function(req, res) {

    client.get('wins', function(err, reply) {
        $coinFlips.wins = reply;
    });

    client.get('losses', function(err, reply) {
        $coinFlips.losses = reply;
    });

    response = {
        "wins": $coinFlips.wins,
        "losses": $coinFlips.losses
    };
    res.send(response);
});

app.delete("/stats", function(req, res) {
    client.set('wins', 0);
    client.set('losses', 0);
});
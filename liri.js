require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var fs = require("fs");

var moment = require('moment');
moment().format();

//Variables for command line arguments
var searchFunction = process.argv[2]
var searchTerm = process.argv.slice(3).join(" ");

//Determines which function to call
if (searchFunction === "concert-this") {
    concertThis();
}
else if (searchFunction === "spotify-this-song") {
    spotifyThisSong();
}
else if (searchFunction === "movie-this") {
    movieThis();
}
else if (searchFunction === "do-what-it-says") {
    doWhatItSays();
}
else {
    console.log("Please choose a valid search term from this list: concert-this, spotify-this-song, movie-this or do-what-it-says.")
}

//concert-this command
function concertThis () {
    var URL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";

    axios.get(URL).then(function(response) {
        var jsonData = response.data;

        var concertArray = [];

        for (var i = 0; i < jsonData.length; i++) {
            var concertInfo = [
                `Venue: ${jsonData[i].venue.name}`,
                `Location: ${jsonData[i].venue.city}, ${jsonData[i].venue.region}`,
                `Date: ${moment(jsonData[i].datetime).format('MM/DD/YYYY')}`
            ].join("\n");

            concertArray.push(concertInfo);
        };

        fs.appendFile("./log.txt", concertArray, function (err){
            if (err) throw err;
        });

        console.log("\n**********************************\n" + concertArray.join("\n**********************************\n"));

    });

};

//spotify-this-song command
function spotifyThisSong () {

    if (!searchTerm) {
        searchTerm = "The Sign";
    };

    spotify.search({ type: 'track', query: searchTerm, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songInfo = [
            `Song Name: ${data.tracks.items[0].name}`,
            `Artist: ${data.tracks.items[0].album.artists[0].name}`,
            `Album: ${data.tracks.items[0].album.name}`,
            `Preview link: ${data.tracks.items[0].external_urls.spotify}`
        ].join("\n");

        fs.appendFile("./log.txt", songInfo, function (err){
            if (err) throw err;
        });
       
        console.log(songInfo); 

    });

};

//movie-this command
function movieThis () {

    if (!searchTerm) {
        searchTerm = "Mr. Nobody";
    };

    var URL = "http://www.omdbapi.com/?apikey=trilogy&t=" + searchTerm;

    axios.get(URL).then(function(response) {
        var jsonData = response.data;

        var movieInfo = [
            `Title: ${jsonData.Title}`,
            `Year: ${jsonData.Year}`,
            `IMDB Rating: ${jsonData.Ratings[0].Value}`,
            `Rotten Tomatoes Rating: ${jsonData.Ratings[0].Value}`,
            `Country: ${jsonData.Country}`,
            `Language: ${jsonData.Language}`,
            `Plot: ${jsonData.Plot}`,
            `Actors: ${jsonData.Actors}`
        ].join("\n");

        fs.appendFile("./log.txt", movieInfo, function (err){
            if (err) throw err;
        });

        console.log(movieInfo);

    });

};

//do-what-it-says command
function doWhatItSays () {

    fs.readFile("./random.txt", "utf8", function read (err, data) {
        if (err) throw err;

        var content = data.split(",");

        searchFunction = content[0];
        searchTerm = content[1];

        spotifyThisSong();

    });

};
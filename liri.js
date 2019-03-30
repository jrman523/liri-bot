require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");

const spotify = new Spotify(keys.spotify);
// const omdbKey = keys.omdb.apiKey;
// const bandsKey = keys.bands.apiKey;


const cmd = process.argv[2];
const input = process.argv[3];


switch (cmd) {
    case ('concert-this'):
        getConcert();
        break;
    case ('spotify-this-song'):
        if (input) {
            spotifyThisSong(input);
        } else {
            spotifyThisSong("My Heart Will Go On");
        }
        break;
    case ('movie-this'):
        if (input) {
            omdb(input);
        } else {
            omdb("Crazy, Stupid, Love.");
        }
        break;
    case ('do-what-it-says'):
        readFile();
        break;
    default:
        console.log('\nTry again');
}

function error(data) {
    console.log('\nError occurred WHEN SEARCHING FOR ' + data);
}

function getConcert(artist) {
    var bandUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandUrl).then(function (res) {
        var response = res.data;
        for (let i = 0; response.length; i++) {
            console.log("\n Name of the venue : " + response[i].venue.name);
            console.log("\n The venue is in " + response[i].venue.country + "," + response[i].venue.city);
            console.log("\n The date of the venue is " + moment(response[i].datetime).format("MM/DD/YYYY"));
        }
    });
}

function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (!err) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("\n Artist: " + songData.artists[0].name);
                console.log("\n Song: " + songData.name);
                console.log("\n Album: " + songData.album.name);
                console.log("\n Preview URL: " + songData.preview_url);
                console.log("\n-----------------------\n");
            }
        } else {
            error(song);
        }
    });
}

function omdb(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&apikey=trilogy&plot=short&tomatoes=true';

    axios.get(omdbURL).then(function (res) {
        if (movie === "Mr. Nobody") {
            console.log("\n If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("\n It's on Netflix!");

        } else {
            var response = res.data;

            console.log("\n Title: " + response.Title);
            console.log("\n Release Year: " + response.Year);
            console.log("\n IMdB Rating: " + response.imdbRating);
            console.log("\n Country: " + response.Country);
            console.log("\n Language: " + response.Language);
            console.log("\n Plot: " + response.Plot);
            console.log("\n Actors: " + response.Actors);
            console.log("\n Rotten Tomatoes Rating: " + response.tomatoRating);
            console.log("\n Rotten Tomatoes URL: " + response.tomatoURL);

        }
    });
}

function readFile() {
    fs.readFile('random.txt', "utf8", function (err, data) {
        var txt = data.split(',');

        spotifyThisSong(txt[1]);
    });
}
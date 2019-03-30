require("dotenv").config();
const keys = require("./keys.js");
const spotify = require('node-spotify-api');
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");

const spotKey = new spotify(keys.spotify);
const omdbKey = keys.omdb.apiKey;
const bandsKey = keys.bands.apiKey;


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
    var bandUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bandsKey;
    axios.get(bandUrl).then(function (err, res) {
        if (!err) {
            for (let i = 0; res.length; i++) {
                console.log("\n Name of the venue : " + res[i].venue.name);
                console.log("\n The venue is in " + res[i].venue.country + "," + res[i].venue.city);
                console.log("\n The date of the venue is " + moment(res[i].datetime).format("MM/DD/YYYY"));
            }
        } else {
            error(artist);
        }
    });
}

function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
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
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&apikey=' + omdbKey + '&plot=short&tomatoes=true';

    request(omdbURL, function (err, res) {

        if (movie === "Mr. Nobody") {
            console.log("\n If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("\n It's on Netflix!");

        } else {
            if (!err) {
                var res = JSON.parse(res);

                console.log("\n Title: " + res.Title);
                console.log("\n Release Year: " + res.Year);
                console.log("\n IMdB Rating: " + res.imdbRating);
                console.log("\n Country: " + res.Country);
                console.log("\n Language: " + res.Language);
                console.log("\n Plot: " + res.Plot);
                console.log("\n Actors: " + res.Actors);
                console.log("\n Rotten Tomatoes Rating: " + res.tomatoRating);
                console.log("\n Rotten Tomatoes URL: " + res.tomatoURL);

            } else {
                error(movie);
            }
        }
    });

}

function readFile() {
    fs.readFile('random.txt', "utf8", function (err, data) {
        var txt = data.split(',');

        spotifyThisSong(txt[1]);
    });
}
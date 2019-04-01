const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");

const spotify = new Spotify(keys.spotify);
const omdbKey = keys.omdb.apiKey;
const bandsKey = keys.bands.apiKey;


const cmd = process.argv[2];
const input = process.argv.slice(3).join(" ");

// current time
const current = "\n-----------" + moment().format("MM-DD-YYYY-LTS") + "---------------\n";
const divider = "\n------------------------------------------------------------\n";

switch (cmd) {
    case ('concert-this'):
        getConcert(input);
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

function error(error) {
    console.log(error);
}

function append(data) {
    var command = "\n User Command: " + cmd + "\n";
    var userInput = "\n User Input: " + input + "\n";
    fs.appendFile("log.txt", command + userInput + current + data + divider, function (err) {
        if (err) throw err;
        console.log(data);
    });
}

function getConcert(artist) {
    var bandUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bandsKey;
    axios.get(bandUrl).then(function (res) {
        var response = res.data;
        for (let i = 0; response.length; i++) {
            var showData = [
                "Name of the venue : " + response[i].venue.name,
                "The venue is in " + response[i].venue.country + "," + response[i].venue.city,
                "The date of the venue is " + moment(response[i].datetime).format("MM/DD/YYYY"),
                divider
            ].join("\n\n");

            append(showData);
        }
    })
        .catch(function (err) {
            error(err);
        });
}

function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song, limit: 3 }, function (err, data) {
        if (!err) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                var showData = [
                    "Artist: " + songData.artists[0].name,
                    "Song: " + songData.name,
                    "Album: " + songData.album.name,
                    "Preview URL: " + songData.preview_url
                ].join("\n\n");

                append(showData);
            }
        } else {
            error(err);
        }
    });
}

function omdb(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&apikey=' + omdbKey + '&plot=short&tomatoes=true';

    axios.get(omdbURL).then(function (res) {
        if (movie === "Mr. Nobody") {
            var Nobody = [
                "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/",
                "It's on Netflix!"
            ].join("\n\n");

            append(Nobody);

        } else {
            var response = res.data;

            var showData = [
                "Title: " + response.Title,
                "Release Year: " + response.Year,
                "IMDb Rating: " + response.imdbRating,
                "Country: " + response.Country,
                "Language: " + response.Language,
                "Plot: " + response.Plot,
                "Actors: " + response.Actors,
                "Rotten Tomatoes Rating: " + response.tomatoRating,
                "Rotten Tomatoes URL: " + response.tomatoURL
            ].join("\n\n");

            append(showData);
        }
    })
        .catch(function (err) {
            error(err);
        });
}

function readFile() {
    fs.readFile('random.txt', "utf8", function (err, data) {
        var txt = data.split(',');

        spotifyThisSong(txt[1]);
    });
}
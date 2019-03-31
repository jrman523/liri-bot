var env = require('dotenv').config();

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    apiKey: process.env.OMDB_API_KEY
};

exports.bands = {
    apiKey: process.env.BANDS_API_KEY
};
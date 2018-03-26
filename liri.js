require("dotenv").config();

const keys = require('./keys');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var inputString = process.argv;
var command = inputString[2];
var searchTerm = inputString[3];

switch (command) {
	case "my-tweets":
		var params = {
			screen_name: 'belobig',
			count: 20
		};
		client.get('statuses/user_timeline', params, function (error, tweets, response) {
			if (!error) {
				for (let i = 0; i < tweets.length; i++) {
					var tweetTime = tweets[i].created_at;
					var tweetText = tweets[i].text;
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTweet #" + (i + 1) + ", Created " + tweetTime + "\nTweet Text:\n" + tweetText + "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				}
			}
		});
		break;

	case "spotify-this-song":
		var spotifySearchTearm;
		if (searchTerm) {
			spotifySearchTearm = {
				query: searchTerm,
				type: 'track',
				limit: 1
			};
		} else {
			spotifySearchTearm = {
				query: 'The Sign - Ace of Base',
				type: 'track',
				artist: 'Ace of Base',
				limit: 1
			};
		}
		spotify.search(spotifySearchTearm, function (err, data) {
			if (err) {
				return console.log('Ah crud. An error occurred: ' + err);
			}
			var Artist = data.tracks.items[0].artists[0].name;
			var Song = data.tracks.items[0].name;
			var Preview = data.tracks.items[0].preview_url;
			var Album = data.tracks.items[0].album.name;
			console.log("\n~*~*~*~*~*~*~*~*~*~*~*~*~*~\nArtist: " + Artist + "\nSong Name: " + Song + "\nPreview URL: " + Preview + "\nAlbum: " + Album + "\n~*~*~*~*~*~*~*~*~*~*~*~*~*~");
		});
		break;

	case "movie-this":
		console.log("Movie info: ");
		break;

	case "do-what-it-says":
		console.log("I did what it said: ");
		break;

	default:
		console.log("I don't recognize that command. Try again, noob.");
}

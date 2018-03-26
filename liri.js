// Requiring all the packages I'll need

require("dotenv").config();

const keys = require('./keys');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
var omdbApi = require('omdb-client');
var fs = require('fs');
var exec = require('child_process').exec;

// variable to use for the command invoked by the do-what-it-says command
var cmd;

// Initiating Spotify and Twitter with keys in .env via keys.js
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// Tried to pull key from .env file via keys.js for OMDB as well, but ended up just pulling the key directly from process.env for now
// var omdb = new OMDB(keys.omdb);

// Variables for user input
var inputString = process.argv;
var command = inputString[2];
var searchTerm = inputString[3];

// Switch block to determine what to do with user input
switch (command) {
	// What happens when user enters the my-tweets command
	case "my-tweets":
		var params = {
			screen_name: 'belobig',
			count: 20
		};
		// Query the Twitter API via GET method
		client.get('statuses/user_timeline', params, function (error, tweets, response) {
			if (!error) {
				for (let i = 0; i < tweets.length; i++) {
					var tweetTime = tweets[i].created_at;
					var tweetText = tweets[i].text;
					console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTweet #" + (i + 1) + ", Created " + tweetTime + "\nTweet Text:\n" + tweetText + "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
					// Write to log
					fs.appendFile("log.txt", "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTweet #" + (i + 1) + ", Created " + tweetTime + "\nTweet Text:\n" + tweetText + "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", function (err) {
						if (err) {
							console.log("Failed to update log.txt");
						}
						// console.log("Updated log.txt");
					});

				}
			} else {
				console.log("The bird ain't tweetin': " + error);
			}
		});
		break;

	// What happens when user enters the spotify-this-song command
	case "spotify-this-song":
		var spotifySearchTearm;
		if (searchTerm) {
			spotifySearchTearm = {
				query: searchTerm,
				type: 'track',
				limit: 1
			};
			// If user doesn't enter a search term, it assumes they like Ace of Base and uses the following info
		} else {
			spotifySearchTearm = {
				query: 'The Sign - Ace of Base',
				type: 'track',
				artist: 'Ace of Base',
				limit: 1
			};
		}
		// Query the Spotify API via SEARCH method -- may consider using GET, but might have to change variable definitions for Artist, Song, Preview, and Album
		spotify.search(spotifySearchTearm, function (err, data) {
			if (err) {
				return console.log('Ah crud. An error occurred: ' + err);
			}
			var Artist = data.tracks.items[0].artists[0].name;
			var Song = data.tracks.items[0].name;
			var Preview = data.tracks.items[0].preview_url;
			var Album = data.tracks.items[0].album.name;
			console.log("\n~*~*~*~*~*~*~*~*~*~*~*~*~*~\nArtist: " + Artist + "\nSong Name: " + Song + "\nPreview URL: " + Preview + "\nAlbum: " + Album + "\n~*~*~*~*~*~*~*~*~*~*~*~*~*~");
			// Write to log
			fs.appendFile("log.txt", "\n~*~*~*~*~*~*~*~*~*~*~*~*~*~\nArtist: " + Artist + "\nSong Name: " + Song + "\nPreview URL: " + Preview + "\nAlbum: " + Album + "\n~*~*~*~*~*~*~*~*~*~*~*~*~*~", function (err) {
				if (err) {
					console.log("Failed to update log.txt");
				}
				// console.log("Updated log.txt");
			});
		});
		break;

	// What happens when user enters the movie-this command
	case "movie-this":
		var params;
		if (searchTerm) {
			params = {
				apiKey: process.env.OMDB_KEY,
				title: searchTerm,
				plot: 'short',
				incTomatoes: true
			}
			// If no input, just search for Mr. Nobody
		} else {
			params = {
				apiKey: process.env.OMDB_KEY,
				title: 'Mr. Nobody',
				plot: 'short',
				incTomatoes: true
			}
		}
		// Query the OMDB API via GET method
		omdbApi.get(params, function (err, data) {
			if (err) {
				return console.log(err);
			}
			var title = data.Title;
			var year = data.Year;
			var rating = data.Rated;
			var imdbRating = data.imdbRating;
			var tomatoRating = data.tomatoRating;
			var country = data.Country;
			var language = data.Language;
			var plot = data.Plot;
			var actors = data.Actors;
			console.log("\n^^^^^^^^^^^^^^^^^^^^^\nTitle: " + title + "\nYear: " + year + "\nRating: " + rating + "\nIMDB Rating : " + imdbRating + "\nRotten Tomatoes Rating : " + tomatoRating + "\nCountry: " + country + "\nLanguage: " + language + "\nPlot: " + plot + "\nActors: " + actors + "\n^^^^^^^^^^^^^^^^^^^^^");
			// Write to log
			fs.appendFile("log.txt", "\n^^^^^^^^^^^^^^^^^^^^^\nTitle: " + title + "\nYear: " + year + "\nRating: " + rating + "\nIMDB Rating : " + imdbRating + "\nRotten Tomatoes Rating : " + tomatoRating + "\nCountry: " + country + "\nLanguage: " + language + "\nPlot: " + plot + "\nActors: " + actors + "\n^^^^^^^^^^^^^^^^^^^^^", function (err) {
				if (err) {
					console.log("Failed to update log.txt");
				}
				// console.log("Updated log.txt");
			});
		});

		break;

		// What happens when user enters the do-what-it-says command
	case "do-what-it-says":
		fs.readFile('random.txt', function (err, data) {
			if (err) {
				console.log(err);
			}
			console.log("\n*$*$*$*$*$*$*$*$*$*$*$*$*$*$*$\nHere's what it says: " + data + "\n*$*$*$*$*$*$*$*$*$*$*$*$*$*$*$");
			cmd = ('node liri.js ' + data);
			exec(cmd, function (error, stdout, stderr) {
				// command output is in stdout
				console.log(stdout);
				if (stderr) {
					console.log('stderr: ' + stderr);
				}

				if (error) {
					console.log('exec error: ' + error);
				}
			});
			// Write to log
			fs.appendFile("log.txt", "\n*$*$*$*$*$*$*$*$*$*$*$*$*$*$*$\nHere's what it says: " + data + "\n*$*$*$*$*$*$*$*$*$*$*$*$*$*$*$", function (err) {
				if (err) {
					console.log("Failed to update log.txt");
				}
				// console.log("Updated log.txt");
			});
		});

		break;
		// What happens if the user enters a bad command
	default:
		console.log("I don't recognize that command. Try again, noob.");
		console.log(process.env.OMDB_KEY);
}

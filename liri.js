// pull in th data from key.js
require("dotenv").config();
var key = require("./key.js");

// pull in information from the node-spotify-api module
var Spotify = require('node-spotify-api')
// take the object from key.js and set it to a variable
var spotify = new Spotify(key.spotify);
// pull in the data for axios
var axios = require("axios");
// pull in the data from moment to be able to format dates and times
var moment = require("moment")
// allows to read data from the random.text file
var fs = require("fs");
// sets the second index from the array process.argv and sets it to the variable method
var method = process.argv[2];
// clear out the first 3 slots in the array process.argv and clear them out and set what is ever remaining to the variable obj
var obj = process.argv.slice(3).join(" ");


// ------- spotify-this-song  --------//
if (method == "spotify-this-song") {
    spotifyThis()
    addFile();
}

function spotifyThis() {
    //if nothing is typed in after spotify-this-song this is the default
    if (!obj) {
        spotify
            .search({ type: 'track', query: "the sign" })
            .then(function (response) {
                console.log("\n-----");
                console.log("The album name is " + response.tracks.items[8].album.name);
                console.log("The artist name is " + response.tracks.items[8].album.artists[0].name);
                console.log("Click this link if you want a preview of the song " + response.tracks.items[8].preview_url);
                console.log("Song title: " + response.tracks.items[8].name);

            })
    }
    // is a song is typed in after spotify-this-song
    else {
        spotify
            .search({ type: 'track', query: obj })
            .then(function (response) {
                for (let i = 0; i < response.tracks.items.length; i++) {
                    console.log("\n-----");
                    console.log("The album name is " + response.tracks.items[i].album.name);
                    console.log("The artist name is " + response.tracks.items[i].album.artists[0].name);
                    console.log("Click this link if you want a preview of the song " + response.tracks.items[i].preview_url);
                    console.log("Song title: " + response.tracks.items[i].name);
                }

            })
    }
}
//-----  movie-this  -------//
if (method == "movie-this") {
    movieThis();
    addFile();
}
function movieThis() {
    // if no movie is entered this is the default
    if (!obj) {
        axios.get("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log("\n---------------\n")
                console.log(response.data.Title);
                console.log("This movie came out in " + response.data.Year);
                console.log("The IMDB rating is: " + response.data.imdbRating);
                console.log("The Rotten tomatoes rating is: " + response.data.Ratings[1].Value);
                console.log("This movie was produced in " + response.data.Country)
                console.log("This movie was spoken in " + response.data.Language);
                console.log("This movies plot is " + response.data.Plot)
                console.log("Actors in this movie are " + response.data.Actors)
                console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/")
                console.log("It's on Netflix")
                console.log("\n---------------\n")
            })
    }
    // take the users movie and search through omdb
    else {
        axios.get("http://www.omdbapi.com/?t=" + obj + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log("\n---------------\n")
                console.log(response.data.Title);
                console.log("This movie came out in " + response.data.Year);
                console.log("The IMDB rating is: " + response.data.imdbRating);
                console.log("The Rotten tomatoes rating is: " + response.data.Ratings[1].Value);
                console.log("This movie was produced in " + response.data.Country)
                console.log("This movie was spoken in " + response.data.Language);
                console.log("This movies plot is " + response.data.Plot)
                console.log("Actors in this movie are " + response.data.Actors)
                console.log("\n---------------\n")
            })
    }
}
//------ concert-this -----//

if (method == "concert-this") {
    concertThis();
   addFile();
}
function concertThis() {
    // take the user artist and search bansintown for the concert information
    axios.get("https://rest.bandsintown.com/artists/" + obj + "/events?app_id=codingbootcamp").then(
        function (response) {
            for (let i = 0; i < response.data.length; i++) {
                console.log("\n-----")
                console.log(obj + " is playing on " + moment(response.data[i].datetime).format('L') + " at " + response.data[i].venue.name + " in " + response.data[i].venue.city + " " + response.data[0].venue.region)
            }
        }
    )
};
//------- do-what-it-says -----//

// if user enters do-what-it-says read the file random.txt
if (method == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        // split the data by the commas into an array
        //ex [spotify-this-song, "I Want it That Way", movie-this, "Remember The Titans"]
        var output = data.split(",");
        // loop through the index to seperate out the command versus the movie,song, or artist to search
        for (let index = 0; index < output.length; index += 2) {
            let item = index + 1;
            method = output[index]
            obj = output[item]
            if (method === "spotify-this-song") {
                spotifyThis();
            }
            if (method === "movie-this") {
                movieThis();
            }
        }
    }
    )
}
// what the user types in it adds to the page log.txt
function addFile(){
fs.appendFile("log.txt",","+method+ ","+"'" + obj + "'",function(err){
    if(err){
        console.log(err)
    }else {
        console.log("it was added")
    }
});
}
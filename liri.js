var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");
var Twitter = require("twitter");
var spotify = require("spotify");

var client = new Twitter(keys.twitterKeys);


var command = process.argv[2];
var name_ = process.argv.slice(3).join("+");

doCommands(command, name_);

function doCommands(command , name){
switch(command){

	case "my-tweets":
	{
		tweets();
		break;
	}

	case "spotify-this-song":{
		spotify_song(name);
		break;
	}

case "movie-this": {

		movie(name);
		break;
}

case "do-what-it-says": {

	doWhatItSays();
	break;
}

default:{

}
}
}


function doWhatItSays (){

	fs.readFile("random.txt" , "utf8" , read);
}

function read (err , data){
	if (err) {
		console.log(err);
		return;
	} 

var com = data.substring(0,data.indexOf(","));

doCommands(com.trim(), data.substring(data.indexOf(",")+1));



}



function movie(name){

if (name== "")
name = "Mr.+Nobody";


	request({
		url: "http://www.omdbapi.com/?t="+name+"&tomatoes=true",
		method: "GET"
	}, function (err, response , body){
		
		var data = "";

		if (!err && response.statusCode === 200) {

		 data +="Title: "  + body.Title + "\n" ;
		 data +="Year: "  + body.Year + "\n";
		 data +="IMDB Rating: " +body.imdbRating + "\n" ;
		 data += "Language: "+ body.Language + "\n";
		 data +="Actors: " + body.Actors + "\n" ;
		 data += "Plot: " + body.Plot + "\n";
		 data += "Tomato Rating: " + body.tomatoRating + "\n"
		 data += "Tomato URL: " + body.tomatoURL + "\n"
		   


		 console.log(data);  
		 writeToFile(data);

		}
	})
}


function spotify_song (name){ 

var songs = " " ; 

spotify.search({ type: 'track', query: name+"&limit=10" }, function(err, data) {
	if ( err ) {
		console.log('Error occurred: ' + err);
		return;
	}

	

for ( var i = 0 ; i < data.tracks.items.length-1 ; i++){
	
console.log("Artist: " + data.tracks.items[i].artists[0].name.toString() + "\nSong: " +  data.tracks.items[i].name.toString() + "\n");
songs +=   "Artist: " + data.tracks.items[i].artists[0].name.toString() + "\nSong: " +  data.tracks.items[i].name.toString() + "\n";

}

writeToFile(data);
 //   console.log(JSON.stringify(data, null, 2));

	//console.log(json.tracks.items[0].album.artists[0].id);
 
	// Do something with 'data' 
});

}

function tweets(){

var params = {
	   screen_name: '@YouTube', 
	   count: 10,
	   result_type: 'recent'
   };

   client.get('statuses/user_timeline', params, displayTweets);

   function displayTweets(err, data, response)
   {
	   if(err)
	   {
		   console.log("Error getting tweets: " + err);
		   return;
	   }
	   //console.log(data);
	   var output = "";
	   if (data.length == 0)
	   {
		   var screen_name = params.screen_name;
		   output = "No tweets " + "\n";
	   }
	   else{

		   output = "Tweets from " +  data[0].user.name + " - " + data[0].user.screen_name + ":\n";
		   for(var i = 0; i < data.length; i++)
		   {
			   output +=  (i+1) + " -> " + data[i].text + "\n";
		   }
	   }

	   console.log(output);
	   writeToFile(output);
	 

   }

}


function writeToFile(data){

data += "\n------------------------------------------\n";
	fs.appendFile("data.txt", data, writeErr  );
}

function writeErr (err){

	if (err){
		console.log(err);
	}
}

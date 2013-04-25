
var url = require('url');
// Express initialization
var express = require('express');
var app = express(express.logger());
app.use(express.bodyParser());
app.set('title', 'nodeapp');

// Mongo initialization
mongodb://<user>:<password>@alex.mongohq.com:10047/app14993966
var databaseUrl = process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL || "mongodb://localhost/scorebase/"
||"mongodb://brookelfnichols@gmail.com:hork-bajir#4@alex.mongohq.com:10047/app14993966"; 
var collections = ["highscores"]
var db = require("mongojs").connect(databaseUrl, collections);

//Middleware: Allows cross-domain requests (CORS)
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

//App config
app.configure(function() {
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'secret' }));
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {

	//app.register('index.html', require('jade'));

	db.highscores.find().sort({score:-1}, function(err, highscores){
		res.setHeader('Content-Type', 'application/json')
		// if(err || !things) console.log("nothing found");
		
		res.send(JSON.stringify(highscores));
		//}
	});
		//DELETES NULL DATA
		db.highscores.remove( {username:null},1)				
});
//post
app.post('/submit.json', function (req, res){

	
	var username = req.body.username
	var score = req.body.score
	var game_title = req.body.game_title
	var form = {
		game_title: game_title,
		score: score,
		username: username,
		created_at: new Date
	}

	
	if(!score.hasOwnProperty('score') || !game_title.hasOwnProperty('game_title') 
		||!username.hasOwnProperty('username') )
		res.end("bad request")

	 db.highscores.insert(form, function(err, results){

	 	if (err){
	 	
	 	}
	 });

	res.set('Content-Type', 'application/json')
	res.end('request received')

});

app.get('/highscores.json', function (req, res){


	var game_title = req.body.game_title
	
	db.highscores.find(game_title).limit(10).sort({score:-1}, function(err, highscores){
		res.setHeader('Content-Type', 'application/json');
		
		res.send(JSON.stringify(highscores));
	
	});


});

app.get('/usersearch.json', function (req, res){



	var query = url.parse(req.url,true).query;

	var form = { username: query.username}

	db.highscores.find(form).sort({score:-1}, function(err, highscores){
		res.setHeader('Content-Type', 'application/json')
		res.send(JSON.stringify(highscores));
	
	});


});


app.get('/usersearch', function (req, res){

	res.set('Content-Type', 'text/html')
	res.sendfile('usersearch.html');


});



app.listen(process.env.PORT || 5000);
var express = require ('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');

//const Db = require(__dirname +'/db_module.js')

//here comes the middleware stuff!

app.use(express.static(__dirname+'/includes')) 

//bodyparser here
app.use(bodyParser.urlencoded({extended: true}))

//set engine view as pug

app.set('views', __dirname+'/views');
app.set('view engine', 'pug');


app.get('/', function(req, response) {
	response.render('index')
});


app.listen(3000, function(){
	console.log('listening on 3000 has started');
})
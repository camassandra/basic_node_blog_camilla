var express = require ('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');

const Db = require(__dirname +'/db_module.js')

//here comes the middleware stuff!

app.use(express.static(__dirname+'/includes')) 

//bodyparser here
app.use(bodyParser.urlencoded({extended: true}))

//set engine view as pug

app.set('views', __dirname+'/views');
app.set('view engine', 'pug');

//homepage 
app.get('/', function(req, response) {
	console.log('rendering homepage')
	response.render('index')
});
//about page 
app.get('/about', function(req, response){
	console.log('rendering abt page')
	response.render('about')
});

//
//registration page
app.get('/register', function(req, response){
	console.log('rendering registration page')
	response.render('newuser')
});
//registering a new user

app.post('/newuserhandler', function(req, response){
	console.log('handling new user request')
	var errorMessage = 'Please enter a valid '
	var target = '';


	if (req.body.firstname.length === 0) {
		target = 'first name'
	
	} 
	else if (req.body.secondname.length === 0) {
		target = 'second name'
		
	}
	else if (req.body.username.length === 0) {
		target = 'username'
	
	}
	else if (req.body.password.length === 0) {
		target = 'password'
		
	}
	else if (req.body.email.length === 0) {
		target = 'email address'
		
	}

	if (target.length === 0) {
		Db.Users.create({
		firstname: req.body.firstname,
		secondname: req.body.secondname ,
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
	})
		response.redirect('/?message=' + encodeURIComponent("Successfully Registered."));
	}
	else response.redirect('/register?message=' + encodeURIComponent(errorMessage + target) + {errMess : errorMessage + target})
});

//render login page
app.get('/userlogin', function(req, response){
	console.log('rendering login page')
	response.render('login')

});

//just trying out if user session post request works 
app.get('/usersession', function(req, response){
	console.log('rendering usersession page')
	Db.Posts.findAll()
    .then((allPosts) => {
        console.log('allPosts')
      
        response.render('usersession', {posts: allPosts})
    })  
});


app.post('/loginhandler', function(req, response){

	response.render('/usersession')
})

//posting new philosophy 
app.post('/posthandler', function(req, response){
	var titlepostqr = req.body.titlepostqr
	console.log(titlepostqr)
 Db.Posts.create({
 	title: titlepostqr,
 	body: req.body.bodypostqr
 }).then( f => {
 	response.redirect('/usersession')
 			})

});

//COMMENT A POST

app.listen(3000, function(){
	console.log('listening on 3000 has started');
})
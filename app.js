var express = require ('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var jsdom = require('jsdom'); //when I was trying to write jquery directly in my app.js...
var bcrypt = require('bcrypt');

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
	response.render('index', {
        message: req.query.message
    });
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
	response.render('newuser', {
		message: req.query.message
	})
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
		bcrypt.hash(req.body.password, 8, function(err, hash){
			if (err) throw err
			Db.Users.create({
				firstname: req.body.firstname,
				secondname: req.body.secondname ,
				username: req.body.username,
				password: hash,
				email: req.body.email,
			})
		})
		
		response.redirect('/?message=' + encodeURIComponent("Successfully Registered."));
	}
	else response.redirect('/register?message=' + encodeURIComponent(errorMessage + target))
});


///creating a session 
app.use(session({
    secret: '9WpXCpH68X',
    resave: true,
    saveUninitialized: false
}));


//render login page
app.get('/userlogin', function(req, response){
	console.log('rendering login page')
	response.render('login', {
        message: req.query.message,
        user: req.session.user,
        
    });
});

//if user logged in can see all posts of all users on a page 
app.get('/allposts', function(req, response){
	var user = req.session.user;
    if (user === undefined) {
        response.redirect('/userlogin?message=' + encodeURIComponent("Please log in to view the cyberpoetry collection."));
    } else {
        console.log('rendering Posts collection page')
		Db.Posts.findAll({ 
		  	include: [Db.Comments]
		}).then((allPosts) => {
	        console.log('allPosts')
	      
        response.render('allposts', {
        	posts: allPosts,

        	})
    
		});
	}
})

//a user is logged out and tries to access his session
app.get('/usersession', function(req, response){
	var user = req.session.user;
    if (user === undefined) {
        response.redirect('/userlogin?message=' + encodeURIComponent("Please log in to view your profile."));
    } else {
        console.log('rendering usersession page')
		Db.Posts.findAll({ 
			where: {userId: req.session.user.id}, 
		  	include: [Db.Comments]
		})
	    .then((allPosts) => {
	        console.log('allPosts' + allPosts)
	      
        response.render('usersession', {posts: allPosts})
    
		});
	}
})

//user logs in - validation and matching database
app.post('/loginhandler', function(req, response){

    if(req.body.username.length === 0) {
        response.redirect('/userlogin?message=' + encodeURIComponent("Please fill out your username."));
        return;
    }

    if(req.body.password.length === 0) {
        response.redirect('/userlogin?message=' + encodeURIComponent("Please fill out your password."));
        return;
    }

    Db.Users.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(function (user) {
    	bcrypt.compare(req.body.password, user.password, function(err, res){
    		if (err) throw err 
    		if (user !== null && res) {
            req.session.user = user;
            console.log('rendering usersession page')
            response.redirect('/usersession');

	        } else {
	            response.redirect('/userlogin?message=' + encodeURIComponent("Invalid email or password."));
	        }
    	})
        
    }, function (error) {
        response.redirect('/userlogin?message=' + encodeURIComponent("Invalid email or password."));
    });
	});

//user can logout from his profile
app.get('/logout', function (req, response) {
    req.session.destroy(function(error) {
        if(error) {
            throw error;
        }
        response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
    })
});


//just trying out if user session post request works 
// app.get('/usersession', function(req, response){
// 	console.log('rendering usersession page')
// 	Db.Posts.findAll()
//     .then((allPosts) => {
//         console.log('allPosts')
      
//         response.render('usersession', {posts: allPosts})
//     })  
// });


//posting new philosophy 
app.post('/posthandler', function(req, response){
	var titlepostqr = req.body.titlepostqr
	console.log(titlepostqr)
	Db.Posts.create({
	 	title: titlepostqr,
	 	body: req.body.bodypostqr,
	 	userId: req.session.user.id
	})
	.then( result => {
 		response.redirect('/usersession')
 	})

});

//COMMENT A POST
app.post('/commenthandler', function(req, response){
	Db.Comments.create({
		comment_author: req.body.comment_author,
		email_author: req.body.email_author,
		comment: req.body.comment,
		postId: req.body.post_id
	})
	.then( comment => {
		response.redirect('/usersession') 
	})
});

app.listen(3000, function(){
	console.log('listening on 3000 has started');
})
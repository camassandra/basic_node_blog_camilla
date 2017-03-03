 

 $('#input').keyup(function(event) {
        event.preventDefault(); // Stops browser from navigating away from page
        var data = $("#input").val();
        console.log(data);
        if (data.length === 3) {
 		$('#error_firstname').text('empty')
 		console.log('empty')
 		}
        // build a json object or do something with the form, store in data
        $.post('/newuserhandler', data, function(resp) {
            console.log(resp);
            // do something when it was successful
        });
    }); 
// app.post('/newuserhandler', function(req, response){
// 	console.log('handling new user request')
// 	var errorMessage = 'Please enter a valid '
// 	var target = '';


// 	if (req.body.firstname.length === 0) {
// 		target = 'first name'
// 		$('#error_firstname').text(errorMessage + target)
// 	} 
// 	else if (req.body.secondname.length === 0) {
// 		target = 'second name'
// 		$('#error_secondname').text(errorMessage + target)
// 	}
// 	else if (req.body.username.length === 0) {
// 		target = 'username'
// 		$('#error_username').text(errorMessage + target)
// 	}
// 	else if (req.body.password.length === 0) {
// 		target = 'password'
// 		$('#error_password').text(errorMessage + target)
// 	}
// 	else if (req.body.email.length === 0) {
// 		target = 'email address'
// 		$('#error_email').text(errorMessage + target)
// 	}

// 	if (target.length === 0) {
// 		Db.Users.create({
// 		firstname: req.body.firstname,
// 		secondname: req.body.secondname ,
// 		username: req.body.username,
// 		password: req.body.password,
// 		email: req.body.email,
// 	})
// 		response.redirect('/?message=' + encodeURIComponent("Successfully Registered."));

// 	}
	
	
// });
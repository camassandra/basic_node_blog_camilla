const Sequelize = require('sequelize');
const db = new Sequelize ('postgres://postgres:' + process.env.POSTGRES_PASSWORD + '@localhost/nodeblog');

const Posts = db.define('posts', {
	title: {
	    type: Sequelize.STRING,
	    allowNull: false
    },
	body: {
		type: Sequelize.STRING,
		allowNull: false
	},
})

const Comments = db.define('comments', {
	comment_author: {
		type: Sequelize.STRING,
		allowNull: true
	},
    email_author: {
		type: Sequelize.STRING,
		allowNull: true
	},
    comment: {
		type: Sequelize.STRING,
		allowNull: true
	},
})
const Users = db.define('users', {
	firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
	secondname: {
		type: Sequelize.STRING,
		allowNull: false
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
}) 
db.sync({
	force: true
})
.then(function(userparameters){
	const userone = {
		firstname: 'Trumping',
		secondname: 'Dummy',
		username: 'dummyuser',
		password: '1234',
		email: 'dummyTrump@yahoo.net'	
	}
	const usertwo = {
		firstname: 'mad',
		secondname: 'max',
		username: 'dummytwo',
		password: '0987',
		email: 'two@gmail.com'
	}

	Users.create(userone)
	Users.create(usertwo)
})
.catch((error) => console.log(error))

.then(function(postparameters){
	const postOne = {
		title: 'Unbearable',
		body: 'How I hate rainy days, all is gloomy',
		userId: 1

	}

	const postTwo = {
		title: 'Smiling and Suffering',
		body: 'This is the teaching of the Buddha: You will not be punished for your anger, you will be punished by your anger.',
		userId: 1	
	}

	const postThree = {
		title: 'The moment',
		body: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.',
		userId: 2
	}
	Posts.create(postOne)
	Posts.create(postTwo)
	Posts.create(postThree)
})
.catch((error) => console.log(error));

Comments.belongsTo(Posts); //adds Posts ID to Comments
Posts.hasMany(Comments); //adds PostsID to Comments
Users.hasMany(Posts); //adds UsersID to Posts

module.exports = {
	Db: db,
	Posts: Posts,
	Users: Users,
	Comments: Comments
}
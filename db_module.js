const Sequelize = require('sequelize');
const db = new Sequelize ('postgres://postgres:' + process.env.POSTGRES_PASSWORD + '@localhost/nodeblog');
const Messages = db.define('messages', {
	title: {
      type: Sequelize.STRING,
      allowNull: false
    },
	body: {
	type: Sequelize.STRING,
	allowNull: false
	}
}) 
db.sync({
	force: true
})
.then(function(postparameters){
	const postOne = {
		title: 'rainy days',
		body: 'how I hate rainy days, all is gloomy',
	}

	const postTwo = {
		title: 'sunny days',
		body: 'I love Amsterdam on sunny days!',
	}

	const postThree = {
		title: 'good advice Maori',
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV === 'test' ? 'test' : 'development';
const config = require('./config')[env];

module.exports = new Sequelize(config.database, config.username, config.password, config);

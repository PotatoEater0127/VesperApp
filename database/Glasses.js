const sequelize = require('./sequelize');
const Sequelize = require('sequelize');

const Glass = sequelize.define('Glass',{
  glass_name: Sequelize.STRING
});

module.exports = Glass;
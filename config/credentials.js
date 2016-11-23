secret = require('../secret.json');
module.exports = "mssql://"+ secret.login + ":" + secret.password + "@localhost/";
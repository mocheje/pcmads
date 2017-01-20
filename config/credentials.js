secret = require('../secret.json');
module.exports = "mssql://"+ secret.login + ":" + secret.password + "@localhost/";
module.exports.PCM = {
    user: secret.login,
    password: secret.password,
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance 
    database: 'PCM',
    requestTimeout: 600000
}

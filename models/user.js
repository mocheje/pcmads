//connect to mssql datasource
var bcrypt   = require('bcrypt-nodejs');
var sql = require('mssql');
var credentials = require('../config/credentials') + "PcmAds";


module.exports = function User (obj) {
    var self = this;
    this.username = obj.username;
    this.password = obj.password;
    this.admin = obj.isAdmin || 0;
    this.generateHash = function(){
        return bcrypt.hashSync(self.password, bcrypt.genSaltSync(8), null);
    };
    this.validPassword = function(password){
        return bcrypt.compareSync(password, this.local.password);
    };
    this.save = function(callback){
        //check if username exists
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query('DECLARE @id uniqueidentifier SET @id = NEWID()' +
                'INSERT INTO [dbo].[users] ([id],[username],[password_hash],[admin])' +
            'VALUES(@id,\'' + self.username + '\',\'' + self.password + '\','+ self.admin + ' )')
                .then(function(recordset) {
                callback(null, recordset);
            }).catch(function(err) {
                // ... query error checks
                callback(err);
            });
        }).catch(function(err) {
            // ... connect error checks
            callback(err);
        });
    }
};

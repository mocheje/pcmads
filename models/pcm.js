var credentials = require('../config/credentials') + "PCM";
var sql = require('mssql');

module.exports = function pcm(){
    this.assignments = function(callback){
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query('SELECT * FROM [PCM].[dbo].[PCMADS_COSTOBJECTASSIGNMENT]')
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
    };
    this.getGls = function(callback){
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_LINEITEM]')
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
    };
    this.getWbs = function(callback){
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_RESPCENTER]')
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
    };
};



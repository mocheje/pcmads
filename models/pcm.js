var credentials = require('../config/credentials') + "PCM";
var sql = require('mssql');
var _ = require('underscore');

module.exports = {
    getAssignments: function(callback){
        console.log(credentials);
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
    },
    getGls: function(callback){
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
    },
    getWbs: function(callback){
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
    },
    getUapcodes: function(callback){
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_UAPCODES]')
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
    },
    getAssets: function(callback){
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_COSTOBJECT]')
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
    },
    getDrivers: function(callback){
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_ACTIVITYDRIVER]')
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
    },
    insertLineItemValueBridge: function(period, data,  searchLine, searchResp, callback){
        // Query
        var version = "Actual";  //hard coded based on PCM version only Actual exists for now
        for(var i = 7; i< data.length; i++){
            var char = "";
            if(i === data.length - 1){
                char = ",";
            } else {
                char = ";"
            }
            var LineItem = data[i][3];
            var sender = data[i][5];
            var currency = data[i][10];
            var value = data[i][9];

            //get lineitem name and sendername


        }
        VALUES = "('" + version + "','" + period + "','" +RespCenterName + "','" + LineItemName + "','" + currency + "','" + value + "')" + char ;
        var query = "INSERT INTO [PCM].[dbo].[PCMADS_BRIDGE] VALUES ";
        sql.connect(credentials).then(function() {
            new sql.Request().query(query)
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
    },
    createView: function(str, callback){
        console.log(credentials);
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query(str)
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
    },
    checkView: function(view, callback){
        console.log(credentials);
        sql.connect(credentials).then(function() {
            // Query
            new sql.Request().query(str)
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



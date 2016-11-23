var express = require('express');
var router = express.Router();
var sql = require('mssql');
var credentials = require('../config/credentials') + "PCM";

/* GET users listing. */
router.post('/', function(req, res, next) {
    //get data
    var data = req.body;
    console.log(data);

    //get objects and compare with uploaded data
    // var version = "Actual";  //hard coded based on PCM version only Actual exists for now
    // for(var i = 7; i< data.length; i++){
    //     var char = "";
    //     if(i === data.length - 1){
    //         char = ",";
    //     } else {
    //         char = ";"
    //     }
    //     var LineItem = data[i][3];
    //     var sender = data[i][5];
    //     var currency = data[i][10];
    //     var value = data[i][9];
    //
    //     //get lineitem name and sendername
    //
    // }
    // VALUES = "('" + version + "','" + period + "','" +RespCenterName + "','" + LineItemName + "','" + currency + "','" + value + "')" + char ;
    // var query = "INSERT INTO [PCM].[dbo].[PCMADS_BRIDGE] VALUES ";
    // sql.connect(credentials).then(function() {
    //     new sql.Request().query(query)
    //         .then(function(recordset) {
    //             callback(null, recordset);
    //         }).catch(function(err) {
    //         // ... query error checks
    //         callback(err);
    //     });
    // }).catch(function(err) {
    //     // ... connect error checks
    //     callback(err);
    // });

    res.json({success: true});
});

module.exports = router;

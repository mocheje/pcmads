var express = require('express');
var router = express.Router();
var sql = require('mssql');
var credentials = require('../config/credentials') + "PCM";

/* GET users listing. */
router.post('/', function(req, res, next) {
    //get data
    var data = req.body.data;
    var period = req.body.period;
    var values = "";
    //get objects and compare with uploaded data
    var version = "Actual";  //hard coded based on PCM version only Actual exists for now
    var completed = 0;
    //implement DRY methods to handle this .... rushing to meet deadline

    sql.connect(credentials).then(function() {
        new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_RESPCENTER]')
            .then(function(recordset) {
                for(var k = 0; k< data.length; k++){
                    for(var l=0;l<recordset.length;l++){
                        if(data[k][5] == recordset[l].NAME.split('-')[0].toString().replace(/\s+/g, '')){
                            data[k][5] = recordset[l].NAME;
                            break;
                        }
                    }
                }
                inform();
            });

        new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_LINEITEM]')
            .then(function(recordset) {
                for(var i = 0; i< data.length; i++){
                    for(var j=0;j<recordset.length;j++){
                        if(data[i][3] == recordset[j].NAME.split('-')[0].toString().replace(/\s+/g, '')){
                            data[i][3] = recordset[j].NAME;
                            break;
                        }
                    }
                }
                inform();
            });


        function inform(){
            completed += 1;
            if(completed == 2){
                var char = ",";
                for (var i = 0; i<data.length; i++){
                    if(i == data.length - 1){
                        char = ";";
                    }
                    var gl = data[i][3], wbs = data[i][5], currency = data[i][10], value = data[i][9];
                    console.log(gl + " " + wbs );
                    values += "('" + version + "','" + period + "','" + wbs + "','" + gl + "','" + currency + "','" + value + "')" + char ;
                }
                var query = "TRUNCATE TABLE [PCM].[dbo].[PCMADS_BRIDGE]; INSERT INTO [PCM].[dbo].[PCMADS_BRIDGE] VALUES " + values;
                console.log(query);
                new sql.Request().query(query)
                    .then(function(recordset) {
                        console.log(recordset);
                        res.json({success: true});
                    })
            }
        };

    }).catch(function(err) {
        // ... connect error checks
        console.log(err);
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');
var xlsx = require('node-xlsx');
var sql = require('mssql');
var credentials = require('../config/credentials');

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.files);
    var Month = {
        'JAN': '001',
        'FEB': '002',
        'MAR': '003',
        'APR': '004',
        'MAY': '005',
        'JUN': '006',
        'JUL': '007',
        'AUG': '008',
        'SEP': '009',
        'OCT': '010',
        'NOV': '011',
        'DEC': '012'
    };
    try{
        var obj = xlsx.parse(fs.readFileSync(req.files[0].path));
        filename = obj[0].name;
        // GET PERIOD FROM FILENAME
        var splname = filename.split(' ');
        var period = Month[splname[0]] + splname[1];
        //match with regular expression to confirm if period is valid
        console.log(period);
        var numOfRecords = obj[0].data.length;
        var data = obj[0].data;
        //get company code
        var compCode = data[1][data[1].length - 1];
        console.log(compCode);
        // get ledger
        var ledger = data[2][data[2].length - 1];
        console.log(ledger);
        var validations = {};
        for(var i=0;i<data.length;i++){
            //perform gl wbs validation.
            //select all gl and wbs mapping.
            
            console.log(data[i]);
            if(i === 10)
                break;
        };
    } catch (e){
        console.log(e);
    }

    //read req.files and perform validation.

    res.json({success: true, period: period, validations: validations, data:  data});

});

module.exports = router;

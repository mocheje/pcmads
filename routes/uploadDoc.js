var express = require('express');
var router = express.Router();
var fs = require('fs');
var xlsx = require('node-xlsx');
var sql = require('mssql');
var pcm = require('../models/pcm');
var credentials = require('../config/credentials') + "PCM";
var _ = require('underscore');

/* GET users listing. */
router.post('/', function(req, res, next) {
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
        filename = req.files[0].originalname;
        // GET PERIOD FROM FILENAME
        var splname = filename.split(' ');
        var period = splname[1] + Month[splname[0]];
        //match with regular expression to confirm if period is valid
        var numOfRecords = obj[0].data.length;
        var data = obj[0].data;
        newData = [];
        //get company code
        var compCode = data[1][data[1].length - 1];
        // get ledger
        var ledger = data[2][data[2].length - 1];
        var validations = {};
    } catch (e){
        console.log(e);
    }
    var completed = 0;
    //get all unique gls and wbs
    var glflags = [], wbsflags = [], glwbsflags = [], gls = [], wbs = [], glwbs = [], l = data.length, i;
    var processed = 0;
    try {
        for(i=0; i<l; i++){ //excluded headers
            //skip unwanted lines
            if(data[i].length < 18 ){
                //delete data[i]; //delete the unwanted line from data array
                data[i] = [];  //temp fix since delete and splice gave unwanted result
            } else {
                if (data[i][1]){
                    //console.log('found header line');
                }else {
                    //push this item to newData
                    newData.push(data[i]);
                    //get unigue wbs
                    if (!wbsflags[data[i][13]]) { //get unique wbs
                        wbsflags[data[i][13]] = true;
                        if (data[i][13])
                            wbs.push(data[i][13]);
                    }
                    if (!glflags[data[i][12]]) { //get unique gls
                        glflags[data[i][12]] = true;
                        if (data[i][12])
                            gls.push(data[i][12]);
                    }
                    if (!glwbsflags[data[i][13] + data[i][12]]) { //get unique gls and wbs
                        glwbsflags[data[i][13] + data[i][12]] = true;
                        if (data[i][13] + data[i][12])
                            glwbs.push({wbs: data[i][13], gl: data[i][12].toString()});
                    }
                }

            }

        }
    } catch (e){
        console.log(e);
    }
    console.log("will connect to sql now");
    //get objects and compare with uploaded data
    sql.connect(credentials).then(function() {
        // Query
        new sql.Request().query('SELECT DISTINCT [GL ACCOUNT], [SENDER WBS] FROM [PCM].[dbo].[PCMADS_COSTOBJECTASSIGNMENT]')
            .then(function(response) {
                if(response) {
                    validations.assignments = [];
                    validations.multipleassignments = [];
                    var reformattedResponse = response.map(function(obj){
                        obj.gl = obj['GL ACCOUNT'].split("-")[0].replace(/\s+/g, '');
                        obj.wbs = obj['SENDER WBS'].split("-")[0].replace(/\s+/g, '');
                        return obj;
                    });
                    for(var i = 0; i<glwbs.length; i++){
                        var found = _.where(reformattedResponse, glwbs[i]);
                        if(found.length > 1){
                            validations.multipleassignments.push(found);
                        } else if(found.length == 1){
                        } else {
                            validations.assignments.push(glwbs[i]);
                        }
                    }
                } else {
                    console.log(err);
                }
                inform();
            }).catch(function(err) {
            // ... query error checks
            console.log(err);
        });


        new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_LINEITEM]')
            .then(function(response) {
                if(response){
                    validations.gls = [];
                    validations.multiplegls = [];
                    var reformattedResponse = response.map(function(obj){
                        obj.gl = obj.NAME.split("-")[0].replace(/\s+/g, '');
                        return obj;
                    });
                    for(var i = 0; i<gls.length; i++){
                        var found = _.where(reformattedResponse, {gl: gls[i].toString()});
                        if(found.length > 1){
                            validations.multiplegls.push(found);
                        } else if(found.length == 1){
                        } else {
                            validations.gls.push(gls[i]);
                        }
                    }
                } else {
                    console.log(err);
                }
                inform();
            }).catch(function(err) {
            // ... query error checks
            console.log(err);
        });

        new sql.Request().query('SELECT [NAME] FROM [PCM].[dbo].[PCMADS_RESPCENTER]')
            .then(function(response) {
                if(response) {
                    validations.wbs = [];
                    validations.multiplewbs = [];
                    var reformattedResponse = response.map(function(obj){
                        obj.wbs = obj.NAME.split("-")[0].replace(/\s+/g, '');
                        return obj;
                    });
                    for(var i = 0; i<wbs.length; i++){
                        var found = _.where(reformattedResponse, {wbs: wbs[i]});
                        if(found.length > 1){
                            validations.multiplewbs.push(found);
                        } else if(found.length == 1){
                        } else {
                            validations.wbs.push(wbs[i]);
                        }
                    }
                } else {
                    console.log(err);
                }
                inform();
            }).catch(function(err) {
            // ... query error checks
            console.log(err);
        });
    }).catch(function(err) {
        // ... connect error checks
        console.log(err);
        res.json({error: err});
    });

    //quick hack to check if processing is complete will use promise later
    function inform(){
        completed += 1;
        if (completed === 3){
            res.json({success: true, period: period, validations: validations, data:  newData});
        }
    }
});

module.exports = router;

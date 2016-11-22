var express = require('express');
var router = express.Router();
var fs = require('fs');
var xlsx = require('node-xlsx');
//var sql = require('mssql');
var pcm = require('../models/pcm');
var credentials = require('../config/credentials');
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
        filename = obj[0].name;
        // GET PERIOD FROM FILENAME
        var splname = filename.split(' ');
        var period = splname[1] + Month[splname[0]];
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
        console.log("got here");
    } catch (e){
        console.log(e);
    }
    //get all unique gls and wbs
    var glflags = [], wbsflags = [], glwbsflags = [], gls = [], wbs = [], glwbs = [], l = data.length, i;
    var processed = 0;
    for(i=7; i<l; i++){ //excluded headers
        //get unigue wbs
        if(wbsflags[data[i][5]]) continue;
        wbsflags[data[i][5]] = true;
        wbs.push(data[i][5]);
    }
    for(i=7; i<l; i++){ //excluded headers
        //get unique gls
        if(glflags[data[i][3]]) continue;
        glflags[data[i][3]] = true;
        gls.push(data[i][3]);
    }
    for(i=7; i<l; i++){ //excluded headers
        //get all unigue gl and wbs combination
        if(glwbsflags[{wbs: data[i][5], gl: data[i][3]}] ) continue;
        glwbsflags[{wbs: data[i][5], gl: data[i][3]}] = true;
        glwbs.push({wbs: data[i][5], gl: data[i][3]});
    }
    console.log(gls, gls.length);
    console.log(wbs, wbs.length);
    console.log(glwbs);
    pcm.getGls(function(err, response){
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
                    console.log("multiple assignment for this object");
                    validations.multiplegls.push(found);
                } else if(found.length == 1){
                    console.log("Found correct assignment for this object");
                } else {
                    console.log("No assignment for this object");
                    validations.gls.push(found);
                }
            }
         } else {
            console.log(err);
        }
        processed += 1;
    });

    pcm.getWbs(function(err, response){
        if(response) {
            validations.wbs = [];
            validations.multiplewbs = [];
            var reformattedResponse = response.data.map(function(obj){
                obj.wbs = obj.NAME.split("-")[0].replace(/\s+/g, '');
                return obj;
            });
            for(var i = 0; i<wbs.length; i++){
                var found = _.where(reformattedResponse, {wbs: wbs[i].toString()});
                if(found.length > 1){
                    console.log("multiple assignment for this object");
                    validations.multiplewbs.push(found);
                } else if(found.length == 1){
                    console.log("Found correct assignment for this object");
                } else {
                    console.log("No assignment for this object");
                    validations.wbs.push(found);
                }
            }
        } else {
            console.log(err);
        }
        processed += 1;
    });

    pcm.getAssignments(function(err, response){
        console.log(response);
        if(response) {
            validations.assignments = [];
            validations.multipleassignments = [];
            var reformattedResponse = response.map(function(obj){
                obj.wbs = obj['GL ACCOUNT'].split("-")[0].replace(/\s+/g, '');
                obj.gl = obj['SENDER WBS'].split("-")[0].replace(/\s+/g, '');
                return obj;
            });
            for(var i = 0; i<glwbs.length; i++){
                var found = _.where(reformattedResponse, {wbs: glwbs[i].toString(), gl: glwbs[i].toString()});
                if(found.length > 1){
                    console.log("multiple assignment for this object");
                    validations.multipleassignments.push(found);
                } else if(found.length == 1){
                    console.log("Found correct assignment for this object");
                } else {
                    console.log("No assignment for this object");
                    validations.assignments.push(found);
                }
            }
        } else {
            console.log(err);
        }
        processed += 1;
    });

    //quick hack to check if processing is complete will use promise later
    setTimeout(function(){
        console.log(processed, " time(s) processing");
        if(processed == 3){
            res.json({success: true, period: period, validations: validations, data:  data});
        }
    }, 1000);
});

module.exports = router;

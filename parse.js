var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var querystring = require('querystring');

const PARSE_HTTP_OPTIONS = {
    hostname: 'mmparse-server.herokuapp.com',
    // hostname: 'localhost',
    port: 80,
    //path: '/parse/classes/Complaint',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // "Content-Length": Buffer.byteLength(data),
        'X-Parse-Application-Id': 'myAppId'
    }
};
function validateComplaintParams(cellNumber, dealershipNameLocation, bookingNumber, userComplain, userComplainNumber, userName) {
    return {
        cellNumber: cellNumber ? cellNumber : 'N/A',
        dealershipNameLocation: dealershipNameLocation ? dealershipNameLocation : 'N/A',
        bookingNumber: bookingNumber ? bookingNumber : 'N/A',
        userComplain: userComplain ? userComplain : 'N/A',
        userName: userName ? userName : 'N/A',
        userComplainNumber: userComplainNumber ? userComplainNumber : 'N/A'
    }
}

function postRequestParams(body) {
    var cellNumber = body.cellNumber;
    var dealershipNameLocation = body.dealershipNameLocation;
    var bookingNumber = body.bookingNumber;
    var userComplain = body.userComplain;
    var userName = body.userName;
    var userComplainNumber = body.userComplainNumber;

    return validateComplaintParams(cellNumber, dealershipNameLocation, bookingNumber, userComplain, userComplainNumber, userName);
}

function getRequestParams(params) {
	var userName = params.userName;
    var cellNumber = params.cellNumber;
    var dealershipNameLocation = params.dealershipNameLocation;
    var bookingNumber = params.bookingNumber;
    var userComplain = params.userComplain;
    var userName = params.userName;
    var userComplainNumber = params.userComplainNumber;

    return validateComplaintParams(cellNumber, dealershipNameLocation, bookingNumber, userComplain, userComplainNumber, userName);
}

function postParseComplaints(params, res, isGet) {
    var data;
    if (isGet) {
        PARSE_HTTP_OPTIONS.method = "GET";
        if (params)
            data = querystring.stringify(params);
    } else {
        PARSE_HTTP_OPTIONS.method = "POST";
        data = JSON.stringify(params);
        PARSE_HTTP_OPTIONS.headers.Content_Length = Buffer.byteLength(data);
    }

    var callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            console.log(str);
            res.json({status: true, data: JSON.parse(str)});
        });
    };

    var req = http.request(PARSE_HTTP_OPTIONS, callback);
    req.on('error', function (err) {
        console.log('problem with request: ' + err.message);
        res.json({status: false, message: err});
    });

    if (!isGet)
        req.write(data);

    req.end();
}

function postToParse(req, res, isGet) {
    var params;
    if (isGet) {
        var temp = url.parse(req.url, true).query;
        params = getRequestParams(temp);
	    if (params)
            data = querystring.stringify(params);
    } else {
		
        params = postRequestParams(req.body);
    }
    postParseComplaints(params, res, false);
}

router.get('/', function (req, res, next) {
    res.json({message: 'server is up and running'})
});

router.get('/parse/save-complaint',
    function (req, res, next) {
        postToParse(req, res, true);
    });

router.get('/parse/cities',
    function (req, res, next) {
        if (isGet) {
		var objectId;
		PARSE_HTTP_OPTIONS.method = "GET";
		var temp = url.parse(req.url, true).query;
		params = return {objectId = temp.id};
    	}
    });

router.post('/parse/save-complaint', function (req, res, next) {
    postToParse(req, res, false);
});

router.route('/parse/get-complaints')
    .get(function (req, res, next) {
        postParseComplaints(null, res, true);
    });

module.exports = router;

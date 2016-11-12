var express = require("express"); // Initialisation of Express.js module for Node.js REST Calling
var app = express(); // Express variable
app.use(express.static(__dirname + '/client'));
var util = require('util');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
//     extended: true
// }));



//var request = require('request');
var request = require('sync-request');

// Routers ---


// 1. Get IRO response
app.get('/iro/:item_d', function(req, res) {

    var item_id = req.params.item_d;
    console.log(util.inspect(item_id));

    var iroUrl = 'http://iro-site-facing.prod-site-facing.iro.services.glb.prod.walmart.com/item-read-service/productOffers?rgs=PRODUCT_CONTENT,PRODUCT_ASSET,OFFER_PRODUCT,OFFER_PRICE,OFFER_INVENTORY,ESTIMATED_SHIP_PRICE,PROMISE_DATE,VARIANT_SUMMARY';

    var _iroRes = request('POST', iroUrl, {
        body: '{"productContexts": [{ "productId": {"USItemId":' + item_id + '}}],"postalAddress": {"addressLineOne": "850 CHERRY AVE","district": "Alameda","addressType": "OFFICE","city": "San Bruno","countryCode": "US","stateOrProvinceName": "California","stateOrProvinceCode": "CA","isApoFpo": false,"isPoBox": false,"postalCode": "94588"}})',
        headers: { //We can define headers too
            'WM_CONSUMER.ID': '37e1ff1c-62fb-4ce4-bba3-72214ad50637',
            'WM_SEC.AUTH_TOKEN': 'ahha',
            'WM_QOS.CORRELATION_ID': '-18006880586',
            'WM_CONSUMER.IP': '127.0.0.1',
            'WM_CONSUMER.INTIMESTAMP': '1335916114312',
            'WM_IFX.CLIENT_TYPE': 'INTERNAL',
            'WM_SVC.VERSION': '1.0',
            'WM_SVC.ENV': 'DEV',
            'Accept': 'application/json',
            'WM_REQUEST_CONTEXT': '{"cAuthId":"43a76da0-a3cf-11e2-9e96-0800200c9a66"}',
            'WM_SVC.NAME': 'blah',
            'Content-Type': 'application/json'
        }
    });

    res.send(JSON.parse(_iroRes.getBody()));

});

// 2. Get Item Page and IRO status
app.post('/itemStatus', function(req, res) {

    var inputArr = req.body;
    console.log('input array: ' + util.inspect(inputArr));

    outputArr = getStatusObject(inputArr);

    console.log('final output array for sending to client: ' + util.inspect(outputArr));
    res.send(outputArr);


});

function getStatusObject(inputArr) {

    var outputArr = new Array();

    var item_id;
    var itemPageUrl = '';
    var _itePageRes;
    var iroUrl = 'http://iro-site-facing.prod-site-facing.iro.services.glb.prod.walmart.com/item-read-service/productOffers?rgs=PRODUCT_CONTENT,PRODUCT_ASSET,OFFER_PRODUCT,OFFER_PRICE,OFFER_INVENTORY,ESTIMATED_SHIP_PRICE,PROMISE_DATE,VARIANT_SUMMARY';

    var itemPageStatus = '';
    var iroStatus = '';

    for (var i = 0, len = inputArr.length; i <= len-1; i++) {

        item_id = inputArr[i];
        itemPageUrl = 'https://www.walmart.com/ip/' + item_id;

        _itePageRes = request('GET', itemPageUrl);
        console.log('synch item page status: ' + util.inspect(_itePageRes.statusCode));
        itemPageStatus = _itePageRes.statusCode;


        iroStatus = '';
        var _iroRes = request('POST', iroUrl, {
            body: '{"productContexts": [{ "productId": {"USItemId":' + item_id + '}}],"postalAddress": {"addressLineOne": "850 CHERRY AVE","district": "Alameda","addressType": "OFFICE","city": "San Bruno","countryCode": "US","stateOrProvinceName": "California","stateOrProvinceCode": "CA","isApoFpo": false,"isPoBox": false,"postalCode": "94588"}})',
            headers: { //We can define headers too
                'WM_CONSUMER.ID': '37e1ff1c-62fb-4ce4-bba3-72214ad50637',
                'WM_SEC.AUTH_TOKEN': 'ahha',
                'WM_QOS.CORRELATION_ID': '-18006880586',
                'WM_CONSUMER.IP': '127.0.0.1',
                'WM_CONSUMER.INTIMESTAMP': '1335916114312',
                'WM_IFX.CLIENT_TYPE': 'INTERNAL',
                'WM_SVC.VERSION': '1.0',
                'WM_SVC.ENV': 'DEV',
                'Accept': 'application/json',
                'WM_REQUEST_CONTEXT': '{"cAuthId":"43a76da0-a3cf-11e2-9e96-0800200c9a66"}',
                'WM_SVC.NAME': 'blah',
                'Content-Type': 'application/json'
            }
        });

        console.log('synch iro response: ' + util.inspect(JSON.parse(_iroRes.getBody())));

        var _iroResObject = JSON.parse(_iroRes.getBody());

        if (_iroResObject.payload[0] && _iroResObject.payload[0].entityErrors[0]) {
            iroStatus = _iroResObject.payload[0].entityErrors[0].code;
        }

        outputArr.push({
            id: i+1,
            ItemId: item_id,
            StatusCode: itemPageStatus,
            IROError: iroStatus
        });
    }

    return outputArr;
}

//  Get Customer details
app.post('/ca', function(req, res) {

    var inputArr = req.body;
    console.log('input array: ' + util.inspect(inputArr));

    outputArr = getCustomerDetails(inputArr);

    console.log('final output array for sending to client: ' + util.inspect(outputArr));
    res.send(outputArr);


});

function getCustomerDetails(inputArr) {

    var outputArr = new Array();

    var customer_id;
    var _caRes;
    var caEndpoint = '';
    var _fName;
    var _lName;
    var _emailId;


    for (var i = 0, len = inputArr.length; i <= len-1; i++) {

        _fName='';
        _lName='';
        _emailId='';

        customer_id = inputArr[i];
        caEndpoint = 'http://ca.prod.walmart.com/ca-app/services/customers/' + customer_id;

        _caRes = request('GET', caEndpoint, {

          headers: { //We can define headers too
            'WM_CONSUMER.ID':'200',
            'WM_QOS.CORRELATION_ID':'1234',
            'WM_SVC.VERSION':'1',
            'WM_SVC.ENV':'prod',
            'WM_SEC.AUTH_TOKEN':'123asdfasfdasdf',
            'WM_CONSUMER.INTIMESTAMP':'12234234234',
            'WM_CONSUMER.IP':'127.0.0.1',
            'WM_CONSUMER.NAME':'RestClient',
            'WM_IFX.CLIENT_TYPE':'INTERNAL',
            'Content-Type':'application/json',
            'WM_SVC.NAME':'caservices'
          }

        });


       console.log('synch ca response status: ' + util.inspect(_caRes));

       switch (_caRes.statusCode) {

         case 200:

                   var _caResObject = JSON.parse(_caRes.getBody());

                   console.log('synch ca response status: ' + util.inspect(_caResObject));


                    if (_caResObject.payload && _caResObject.payload.person && _caResObject.payload.person.names && _caResObject.payload.person.names[0] && _caResObject.payload.person.names[0].personName) {
                        _fName = _caResObject.payload.person.names[0].personName.firstName;
                        _lName = _caResObject.payload.person.names[0].personName.lastName;
                        if (_caResObject.payload && _caResObject.payload.person && _caResObject.payload.person.accounts && _caResObject.payload.person.accounts[0]) {
                            _emailId = _caResObject.payload.person.accounts[0].emailAddress;
                        }
                    }

          break;

         default:

                       _fName = 'Person does not exist',
                       _lName = '',
                       _emailId = ''
       }



        outputArr.push({
            customerId: customer_id,
            fName: _fName,
            lName: _lName,
            emailId: _emailId
        });
    }

    return outputArr;
}


//  Loading index.html
app.get('/', function(req, res) {
    res.sendFile('./client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});



// Start the server

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

var Spreadsheet = require('edit-google-spreadsheet');
var async = require('async');
var accessKey = "AKIAIFFES4N5PHGKPK4A";
var secretKey = "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";

var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
  endpoint: "http://dynamodb.ap-south-1.amazonaws.com",
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});

var client = new AWS.DynamoDB();
var documentClient = new AWS.DynamoDB.DocumentClient();


(async function example() {
  let spreadsheet = await Spreadsheet.load({
    debug: true,
    oauth : {
      email: 'pure-century-104705@appspot.gserviceaccount.com',
      keyFile: '../config/google-oauth.pem'
    },
    spreadsheetId: "135ohVCjpsXwjl8OvC_L4pPZCODQbzHCA9Wjc4hUpYCk",
    worksheetName: "test4.csv",
    // worksheetId: "oqdkolh"
  });
  //receive all cells
  let [rows, info] = await spreadsheet.receive({getValues: false});

  console.log("rows RECEIVED");

  async.map(rows,
    function(data,cb){
      if(data['1'] == "Precinct") return cb();
      console.log(data);
      var params = {
          TableName: "Elections",
          Item: {
              "electionId": Math.floor(Math.random() * 1000000000) + 1 ,
              "Precinct": data['1'],
              "Race": data['2'],
              "LEG": data['3'],
              "CC": data['4'],
              "CG": data['5'],
              "CounterGroup": data['6'],
              "Party": data['7'],
              "CounterType": data['8'],
              "SumOfCount": data['9']
          }
      };

      documentClient.put(params, function(err, data) {
          if (err) {
              console.error("Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("Added item successfully!");
          }
          cb()
      });
    }
    ,function(err, results) {
      console.log("Script ran completed with err - ",err);
      // results is now an array of stats for each file
  });
})()
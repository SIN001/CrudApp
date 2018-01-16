var accessKey = "AKIAIFFES4N5PHGKPK4A";
var secretKey = "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";

var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
  endpoint: "http://dynamodb.ap-south-1.amazonaws.com",
  accessKeyId: accessKey,
  secretAccessKey: secretKey
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Elections",
    KeySchema: [       
        { AttributeName: "electionId", KeyType: "HASH"}  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "electionId", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 100
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
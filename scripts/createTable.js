var accessKey = "AKIAI7FOQ7NW2GJL4C2A";
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
    TableName : "Tasks",
    KeySchema: [       
        { AttributeName: "title", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "title", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
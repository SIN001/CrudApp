var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var objectId = require('objectid');
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

app.use(express.static('client'));
app.set('views', __dirname + '/client/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('port', (process.env.PORT || 8008));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.render('index.html');
});

app.get('/tasks', function(req, res){
    var params = {
    TableName: "Tasks"
    };

    documentClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send({err: err});
        } else {
          let newData = data;
            for(let each in data.Items){
              newData.Items[each].update = "Update";
              newData.Items[each].delete = "Delete";
            } 
            console.log("GetItem succeeded:", JSON.stringify(newData, null, 2));
            res.json({data:newData,message:"Fetched Successfully"});
        }
    });
});

app.get('/task/destroy/:title', function(req, res){
    var {title} = req.params;
    var params = {
        TableName:"Tasks",
        Key:{
            "title":title,
        },
        ConditionExpression:"title = :val",
        ExpressionAttributeValues: {
            ":val": title
        }
    };
    console.log("Attempting a conditional delete...");
    documentClient.delete(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send({err: err});
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            res.json({data:data,message:"DeleteItem Successfully"});
        }
    });
});

app.post('/task/create', function(req, res){
    var {name,priority} = req.body;
    var params = {
        TableName: "Tasks",
        Item: {
            "title": name,
            "priority": priority
        }
    };

    documentClient.put(params, function(err, data) {
        if (err) {
            console.error("Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send({err: err});
        } else {
            console.log("Added item successfully!");
            res.json({data:data,message:"Added Successfully"});
        }
    });
});

app.post('/task/update',function(req,res){
     const {title,newPriority}= req.body;
      var table = "Tasks";
      // Update the item, unconditionally,

      var params = {
          TableName:table,
          Key:{
              "title": title,
          },
          UpdateExpression: "set priority=:p",
          ExpressionAttributeValues:{
              ":p":newPriority,
          },
          ReturnValues:"UPDATED_NEW"
      };

      console.log("Updating the item...",title,newPriority);
      documentClient.update(params, function(err, data) {
          if (err) {
              console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
              res.status(500).send({err: err});
          } else {
              console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
              res.json({data:data,message:"Updated Successfully"});
          }
      }); 
})

app.listen(app.get('port'), function() {
    console.log('listening on '+app.get('port'));
});


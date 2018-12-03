var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-northeast-1",
  endpoint: "http://localhost:18000"
}, true);

var dynamodb = new AWS.DynamoDB();

const tableName = 'HiyokoActionLogs'

var params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH"},  //Partition key
      { AttributeName: "createdAt", KeyType: "RANGE"},  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" },
        { AttributeName: "createdAt", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.listTables({})
    .promise()
    .then((data) => {
        console.log(data)
        if (!data.TableNames.includes(tableName)) {
            console.log('table going to be created...')
            dynamodb.createTable(params, function (err, data) {
                if (err) {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                }
            });
        }
    })
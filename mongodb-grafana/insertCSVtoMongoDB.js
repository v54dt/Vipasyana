
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

MongoClient.connect(url, function(err, db)
 {
  if (err) throw err;
  var db_read = db.db("Test0727");
  var db_write = db.db("Test0727");
  db_read.collection("0716").findOne({}, function(err, result) 
  {
    var sensor_mac ='00000001-0000-0000-0000-D2AC31BF0A1C';
    var semsor_rssi = -63;
    
    
    const csv = require('csv-parser');
    const fs = require('fs');

    fs.createReadStream('ecg_data_0.csv')
    .pipe(csv())
    .on('data', (row) => 
    {
        if(row.device_id ==3)
        {
            var t = Number(Math.floor(row.timestamp));
            var mongo_obj = { MAC : sensor_mac,ecg_data : row.data, ts : new Date(t)};
            db_write.collection("0322_fake_ecg_data").insertOne(mongo_obj);
        }
    })
    .on('end', () => 
    {
        console.log('CSV file successfully processed');
    });

   
  });
  //db.close(); asyc need to fix

});


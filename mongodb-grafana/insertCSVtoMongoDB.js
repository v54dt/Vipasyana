
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var db_read = db.db("Test0727");
  var db_write = db.db("Test0727");
  db_read.collection("0716").findOne({}, function (err, result) {
    if (err) throw err;
    var sensor_mac = '00000001-0000-0000-0000-D2AC31BF0A1C';
    var semsor_rssi = -63;


    const csv = require('csv-parser');
    const fs = require('fs');

    fs.createReadStream('C:/Users/黃柏維/Desktop/nodejs/ecg_data_0.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.device_id == 3) {
          var current_time = Number(Date.now());
          var start_time = 1553240835494;
          var t_shift = current_time - start_time;
          var t = Number(Math.floor(row.timestamp)) + t_shift;
          var mongo_obj = { MAC: sensor_mac, device_id: row.device_id, ecg_data: Number(row.data), ts: t };
          db_write.collection("0814_csv").insertOne(mongo_obj);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });


  });
  //db.close(); asyc need to fix

});


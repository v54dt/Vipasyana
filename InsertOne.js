
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://@140.113.144.162:27017";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var db_read = db.db("Test0702");
  var db_write = db.db("WISE-PaaS");
  db_read.collection("0716").findOne({}, function(err, result) {
    
    var time_offset = [0,3,7,11,15,19,23,27,31,35,39,42,46,50,54,58,62,66,70,74,78,82,85,89,93,97,101,105,109,113,117,121,125];
                       // time_offset[32]


    var arr = result.row_data.split(",");

    var packet_time=arr[0];
    //var packet_time = 1524632175894;
    //var packet_time = Date.now();

    var sensor_mac = arr[258];
    //var sensor_mac ='00000001-0000-0000-0000-D2AC31BF0A1C';

    var semsor_rssi = arr[259];
    //var semsor_rssi = -63;
    
   
  
    for(i=0;i<8;i++){
      for(j=0;j<32;j++){
        
        var set_time = new Date(packet_time + (i*125 + time_offset[j]));     
        var mongo_obj = {agentId: sensor_mac, opTS:set_time, n:"ecg", sensorId:"/SenData/RAW", ts:set_time, v:Number(arr[i*8+j+2]) };
        
        //console.log(mongo_obj);
      
        db_write.collection("common_Test").insertOne(mongo_obj);
    
     }
    }
    db.close();

  });
});


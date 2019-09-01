var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var url = 'mongodb://localhost:27017/Test0727';

var time_offset = [0, 3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82, 85, 89, 93, 97, 101, 105, 109, 113, 117, 121];
// time_offset[32]


MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var db_read = db.db("");
    var db_write_ecg = db.db("");
    var db_write_rssi = db.db("");


    function find_delete_parse() {
        var current_time = Date.now();
        console.log(current_time);
        
        db_read.collection("common_SenHub").findOneAndDelete({ opTS: { $gt: new Date(current_time - 2000) , $lt: new Date(current_time - 1000) } }, function (err, result) {
            console.log(result);
            if (result.value != null) {
                async.waterfall([
                    function (callback) {
                        var arr = result.value.row_data.split(",");
                        callback(null, arr);
                    },
                    function (arr, callback) {
                        var packet_time = Number(arr[1]);
                        console.log("mac: ",arr[0]);
                        console.log("rssi: ",arr[3]);
                        for (i = 0; i < 8; i++) {
                            for (j = 0; j < 32; j++) {

                                var set_time = new Date(packet_time + (i * 125 + time_offset[j]));
                                var mongo_obj_ecg = { agentId: "00000001-0000-0000-0017-000E4C000000", v: Number(arr[i * 32 + j+4]), opTS: set_time, n: "ecg_data", sensorId: "/SenData/ecg_data", ts: set_time };
                                db_write_ecg.collection("common_ecg").insertOne(mongo_obj_ecg).catch(err => console.error("fail"));
                            }

                        }
                        var mongo_obj_rssi = { agentId: "00000001-0000-0000-0017-000E4C000000", v: Number(arr[3]), opTS: set_time, n: "rssi", sensorId: "/SenData/rssi", ts: set_time };
                        db_write_rssi.collection("common_rssi").insertOne(mongo_obj_rssi).catch(err => console.error("fail"));

                        
                        callback(null);
                    }

                ], function (err) {

                    if (err) throw err;
                })
            }
        });
    };


    setInterval(find_delete_parse, 500);


});
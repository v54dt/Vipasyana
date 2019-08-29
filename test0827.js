
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var url = "mongodb://localhost:27017";
var time_offset = [0, 3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82, 85, 89, 93, 97, 101, 105, 109, 113, 117, 121];
// time_offset[32]

MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var db_read = db.db("Test0727");
    var db_write = db.db("Test0727");
    
    //db_read.collection("0716").findOne({id:987}).then(console.log("get")).catch(console.log("not"));

    db_read.collection("0716").findOne({}, function (err, result){
        if (err) throw err;
        function a() {
            async.waterfall([
                function (callback) {
                    console.log(result.id);
                    var arr = result.row_data.split(",");
                    callback(null, arr);
                },
                function (arr, callback) {
                    var current_time = Date.now();
                    for (i = 0; i < 8; i++) {
                        for (j = 0; j < 32; j++) {

                            var set_time = new Date(current_time + (i * 125 + time_offset[j]));
                            var mongo_obj = { agentId: "00000001-0000-0000-0017-000E4C000000", v: Number(arr[i * 32 + j]), opTS: set_time, n: "ecg_data", sensorId: "/SenData/string_data", ts: set_time }
                            //console.log(mongo_obj);
                            db_write.collection("common_SenHub").insertOne(mongo_obj).then(/*result => console.log("success")*/).catch(err => console.error("fail"))
                        }
                        console.log(`i : ${i}`);
                    }
                    //var str = "success";
                    callback(null);
                }

            ], function (err) {
                //if (err) throw err;
                //console.log(str);
                //console.log("sd");
            });
        };

        //a();
        console.log("test");

       //a();
       //a();


       setInterval(a,2000);
        /*function b(){
            console.log("GGg");
        }
       setInterval(b,2000);
*/



        /*
        async.waterfall([
            function (callback) {
                console.log(result.id);
                var arr = result.row_data.split(",");
                callback(null, arr);
            },
            function (arr, callback) {
                var current_time = Date.now();
                for (i = 0; i < 8; i++) {
                    for (j = 0; j < 32; j++) {

                        var set_time = new Date(current_time + (i * 125 + time_offset[j]));
                        var mongo_obj = { agentId: "00000001-0000-0000-0017-000E4C000000", v: Number(arr[i * 32 + j]), opTS: set_time, n: "ecg_data", sensorId: "/SenData/string_data", ts: set_time }
                        //console.log(mongo_obj);
                        db_write.collection("common_SenHub").insertOne(mongo_obj);
                    }
                }
                var str = "success";
                callback(null, str);
            }

        ], function (err, str) {

            console.log(str);
        });*/
        //db.close();
    });


});
/*
MongoClient.connect(url, { reconnectInterval: 100 }, function (err, db) {
    if (err) throw err;
    var db_read = db.db("Test0727");
    var db_write = db.db("Test0727");


    db_read.collection("0716").findOne({}, function (err, result) {

        var arr = result.row_data.split(",");
        var packet_time = Number(Date.now());

        //var sensor_mac = arr[258];
        //var sensor_mac ='00000001-0000-0000-0000-D2AC31BF0A1C';
        //var semsor_rssi = arr[259];
        //var semsor_rssi = -63;

        for (i = 0; i < 8; i++) {
            for (j = 0; j < 32; j++) {
                //var i =0,j=0;
                var set_time = new Date(packet_time + (i * 125 + time_offset[j]));
                console.log(packet_time);
                console.log(set_time);

                var mongo_obj = { MAC: sensor_mac, ecg_data: Number(arr[i * 32 + j]), ts: set_time };
                console.log(mongo_obj);

                db_write.collection("0716_parsed").insertOne(mongo_obj);

            }
        }


        db.close();
    });
});


*/
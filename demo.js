var MongoClient = require('mongodb').MongoClient;
var async = require('async');
//var url = 'mongodb://localhost:27017/Test0727';
var url = '' // WISE-PaaS Public MongoDB
//var time_offset = [0, 3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82, 85, 89, 93, 97, 101, 105, 109, 113, 117, 121];
var time_offset = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124];
// time_offset[32]

const Influx = require('influx');
// influx = new Influx.InfluxDB('') // WISE-PaaS Public Influx
//const influx = new Influx.InfluxDB('http://140.113.144.162:8086/demo') Private Influx
const influx = new Influx.InfluxDB('http://localhost:8086/demo')
MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var db_read = db.db("");
    var db_write_ecg = db.db("");
    var db_write_rssi = db.db("");

    //db_read.collection("0716").findOne({id:987}).then(console.log("get")).catch(console.log("not"));

    function find_delete_parse() {
        var current_time = Date.now();
        console.log(current_time);
        //db_read.collection("0716").findOneAndDelete({ opTS: { $gt: new Date(current_time - 2000) /*, $lt: new Date(current_time - 1000)*/ }}).forEach(function (result) {
        db_read.collection("common_SenHub").findOneAndDelete({ /*opTS: { $gt: new Date(current_time - 2000), $lt: new Date(current_time - 1000) } */ }, function (err, result) {
            //console.log(result);
            if (result.value != null && result.value.sv != "") {
                console.log("get data");
                async.waterfall([
                    function (callback) {
                        var arr = result.value.sv.split(",");
                        callback(null, arr);
                    },
                    function (arr, callback) {
                        var packet_time = Number(arr[1]);
                        //console.log("mac: ",arr[0]);
                        //console.log("rssi: ",arr[3]);
                        for (i = 0; i < 8; i++) {
                            for (j = 0; j < 32; j++) {

                                var set_time = new Date(packet_time + (i * 125 + time_offset[j]));
                                var mongo_obj_ecg = { agentId: arr[0], v: Number(arr[i * 32 + j + 4]), opTS: set_time, n: "ecg_data", sensorId: "/SenData/ecg_data", ts: set_time };
                                db_write_ecg.collection("common_ecgdata").insertOne(mongo_obj_ecg).catch(err => console.error("fail"));

                                if (j % 2 === 0) {
                                    influx.writePoints([
                                        {
                                            measurement: 'ecg_data',
                                            fields: { value: Number(arr[i * 32 + j + 4]) }, timestamp: Number((packet_time + (i * 125 + time_offset[j])) * 1000000)
                                        }
                                    ]).catch(err => console.error("influx ecg_data fail"));
                                }
                            }

                        }
                        var mongo_obj_rssi = { agentId: "00000001-0000-0000-0017-000E4C000000", v: Number(arr[3]), opTS: new Date(packet_time), n: "rssi", sensorId: "/SenData/rssi", ts: new Date(packet_time) };
                        db_write_rssi.collection("common_rssi").insertOne(mongo_obj_rssi).catch(err => console.error("fail"));
                        influx.writePoints([
                            {
                                measurement: 'rssi',
                                fields: { value: Number(arr[3]) }, timestamp: Number(packet_time * 1000000)
                            }
                        ]).catch(err => console.error("influx rssi fail"));
                        callback(null);
                    }

                ], function (err) {

                    if (err) throw err;
                })
            }
            else {
                if (result.value === null) {
                    console.log("no data");
                } else if (result.value.sv === "") {
                    console.log("upload sv is empty")
                }
            }
        });
    };


    setInterval(find_delete_parse, 500);


});

//1567577473659755451
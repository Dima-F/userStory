var mongoose = require('./myMongoose');
var Band = require('./models/band').Band;
var async = require('async');

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open',function () {
    //drop current db(from BandApp)
    var db = conn.db;
    db.dropDatabase(function (err) {
        if (err) throw err;
        console.log('Old db(from BandApp) dropped successfully!');
    });

    async.parallel([
        function(callback){
            var clashBand = new Band({bid:2, name:'the Clash'});
            clashBand.members = [
                {name:'Joe Strummer'},
                {name:'Mick Jones'},
                {name:'Poul Simonon'}
            ];
            clashBand.save(function (err) {
                callback(err,clashBand);
            });
        },
        function(callback){
            var pingFloydBand = new Band({bid:3, name:'Ping Floyd'});
            pingFloydBand.save(function (err) {
                callback(err,pingFloydBand);
            });
        },
        function(callback){
            var cremberies = new Band({bid:4, name:'The Cramberries'});
            cremberies.save(function (err) {
                callback(err,cremberies);
            });
        }
    ], function(err, results) {
        console.log(arguments);
        //mongoose.disconnect();
    });
});


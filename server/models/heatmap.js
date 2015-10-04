var MongoClient = require('mongodb').MongoClient
    , Server = require('mongodb').Server
    , trafficVolumeCollectionName = 'traffic_volume'
    , aggregationQueries = require('./aggregation-queries')
    , locationNormalizer = require('./location-normalizer');


var heatmap = {
    getHeatMap: function (startDate, endDate, callback) {
        MongoClient.connect(
            'mongodb://127.0.0.1/trafficjam',
            function (err, db) {
                if (err) {
                    console.log('error');
                    callback(err);
                } else {
                    console.log('yay');
                    var trafficVolumeCollection = db.collection(trafficVolumeCollectionName);


                    var uniqueLocationAggregateList = [
                        aggregationQueries.forRecordsMatchingDateRange(startDate, endDate),
                        aggregationQueries.sumCountsGroupedByArteryCodeAndFirstLocation,
                        aggregationQueries.normalizeCountsForNumberOfMeasurements,
                        aggregationQueries.greaterThan1NormalizedCount
                        //aggregationQueries.groupByLocation
                    ];


                    var returnData = trafficVolumeCollection.aggregate(uniqueLocationAggregateList, function (err, result) {
                        var matchArray = [];
                        var resultArray =[];
                        result.forEach(function(item) {
                            var normalizedName = locationNormalizer(item.name);
                            matchArray.push(normalizedName);
                            resultArray.push(item);
                        });
                        console.log(matchArray);

                        db.collection('locations').find({normalizedLocation: {$in:matchArray}}).toArray(function(err, docs){
                            console.log("retrieved records:");
                            console.log(docs);

                            resultArray.forEach(function(item) {
                                docs.forEach(function(locationItem) {
                                    if(locationItem.normalizedLocation === locationNormalizer(item.name)) {
                                        if(locationItem.location) {
                                            item.latitude = locationItem.location.latitude;
                                            item.longitude = locationItem.location.longitude;
                                        } else {
                                            item.latitude = null;
                                            item.longitude = null;
                                        }
                                    }

                                });
                            });
                            callback(null, result);
                        });







                    });

                }


            });
    }
};

module.exports = heatmap;
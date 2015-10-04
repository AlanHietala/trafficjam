var MongoClient = require('mongodb').MongoClient
  	, Server = require('mongodb').Server
	, limit = require("simple-rate-limiter")
	, trafficVolumeCollectionName = 'traffic_volume';
var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
	apiKey: 'AIzaSyCBX-Bc48_O8pELdf97foOn_6QKKhlyGN0', // for Mapquest, OpenCage, Google Premier
	formatter: null         // 'gpx', 'string', ...
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

 var geoCodeLocation = limit(function (location, callback) {
	 geocoder.geocode(location, function(err, res) {
		 if(err) {
			 console.log('couldnt geocode');
			 callback(err);
		 } else {
			 console.log(res);
			callback(null, res);
		 }
	 });
 }).to(10).per(1000);

function normalizeLocationString(locationString) {
	var fixedString = locationString.replace('WB E OF', 'AND');
	fixedString = fixedString.replace('W/B E OF', 'AND');

	fixedString = fixedString.replace('E/B W OF', 'AND');
	fixedString = fixedString.replace('EB W OF', 'AND');

	fixedString = fixedString.replace('NB S OF', 'AND');
	fixedString = fixedString.replace('N/B S OF', 'AND');

	fixedString = fixedString.replace('S/B N OF', 'AND');
	fixedString = fixedString.replace('SB N OF', 'AND');

	fixedString = fixedString.replace('E/B E OF', 'AND');
	fixedString = fixedString.replace('EB E OF', 'AND');

	fixedString = fixedString.replace('S/B S OF', 'AND');
	fixedString = fixedString.replace('SB S OF', 'AND');

	fixedString = fixedString.replace('N/B N OF', 'AND');
	fixedString = fixedString.replace('NB N OF', 'AND');

	fixedString = fixedString.replace('W/B W OF', 'AND');
	fixedString = fixedString.replace('WB W OF', 'AND');

	fixedString = fixedString.replace('SB NORTH OF', 'AND');
	fixedString = fixedString.replace('SB SOUTH OF', 'AND');

	fixedString = fixedString.replace('N/B S', 'AND');


	return fixedString;
}
function isValidLocationString(locationString) {
	isValid = true;
	invalidRegex = /.*([#0-9\(\)]|\sTO\s|\sLEG$|\sRAMP$).*/;
	if(invalidRegex.test(locationString)) {
		isValid = false;
	}
	return isValid;
}
function saveLocationWithGeocode(location, latLng) {

}

MongoClient.connect(
    'mongodb://127.0.0.1/trafficjam',
    function(err, db) {
	if(err) {
	console.log('error');
	} else {
		console.log('yay');
		var trafficVolumeCollection = db.collection(trafficVolumeCollectionName);
		var groupByLocation =  {
			$group: {_id: '$LOCATION'}
		};
		var normalizeCountsForNumberOfMeasurements = {
			$project: {name: 1, normalizedSum: { $divide: ['$volumeSum', '$arteryCount']}}
		}

		var forRecordsMatchingDateRange = {
			$match: { TIMECOUNT: {$gte: new Date('2010/01/01 00:00:00'), $lte:new Date('2014/12/31 23:59:00')}}
		};
		var countRows =  {
			$group:{_id:null, theCount : {$sum: 1}}
		};

		var sumCountsGroupedByArteryCodeAndFirstLocation =  {
			$group: {_id: '$ARTERYCODE', volumeSum: {$sum:'$Count'}, arteryCount: {$sum: 1}, name:{$first:'$LOCATION'}}
		};

		var greaterThan1NormalizedCount = {
			$match : {normalizedSum: {$gte: 1}}
		};

		var uniqueLocationAggregateList = [
			forRecordsMatchingDateRange,
			sumCountsGroupedByArteryCodeAndFirstLocation,
			normalizeCountsForNumberOfMeasurements,
			greaterThan1NormalizedCount
			//groupByLocation
		];



		trafficVolumeCollection.aggregate(uniqueLocationAggregateList)
			.toArray(function (err, result) {

				result.forEach(function (item) {
					var rawString = item.name;
					var normalizedString = normalizeLocationString(rawString);

					if(isValidLocationString(normalizedString)) {
						console.log(normalizedString);
						geoCodeLocation(normalizedString, function (err, res) {
							if(err) {
								console.log(err);
							} else {
								console.log(res);
								var geocodeCollection = db.collection('locations', function (err, collection) {
									resultRecord = res[0];
									collection.update({normalizedLocation: normalizedString},
										{normalizedLocation: normalizedString, rawLocation: rawString, location:resultRecord},
										{upsert: true});
								});
							}

						});


					}

				});
			});
	}


 });



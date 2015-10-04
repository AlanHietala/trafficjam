'use strict';

angular.module('trafficjam')
    .service('TrafficjamAPI', function Heatmap($http, $q) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var bikeData;
        var api = {
            getHeatmap: function(startDate, endDate) {
               return $http({
                   method: 'GET',
                   url: './heatmap',
                   params: {
                       startdate: startDate,
                       enddate: endDate
                   }
               });
            },
            getBikeShare: function() {
                var deferred = $q.defer();

                if(bikeData) {
                    deferred.resolve(bikeData);


                } else {
                    $http({
                        method: 'GET',
                        url: './data/bikeshare.json',
                        type: 'text/json'
                    }).then(function (data) {
                        bikeData = data.data.stationBeanList;
                        deferred.resolve(bikeData);
                    },
                    function (err) {
                        console.log(err);
                        deferred.reject(err);
                    });
                }
                return deferred.promise;
            }

        }

        return api;
    });

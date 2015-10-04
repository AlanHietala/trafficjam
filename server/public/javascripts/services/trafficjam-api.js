'use strict';

angular.module('trafficjam')
    .service('TrafficjamAPI', function Heatmap($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function

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
            }

        }

        return api;
    });

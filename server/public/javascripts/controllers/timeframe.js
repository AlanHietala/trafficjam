'use strict';

angular.module('trafficjam')
    .controller('TimeframeCtrl', function ($scope, $document, TrafficjamAPI, MapService) {
        $scope.color = "#ff0000";
        var map = MapService.getMap();
        var timeframeEnabled = false;
        var dateChanged = true;
        $scope.toggleClass = 'btn-default';
        $scope.startDate = new Date('2014/06/01 00:00:00');
        $scope.endDate = new Date('2014/12/31 23:59:00');
        $scope.$watch('startDate', function(newVal) {
            dateChanged = true;
        });
        $scope.$watch('endDate', function (newVal) {
            dateChanged = true;
        });
        $scope.toggleTimeframe = function () {
            if(timeframeEnabled) {
                clearMapData();
                $scope.toggleClass = 'btn-default';
                timeframeEnabled = false;
            } else {
                if(dateChanged) {
                    TrafficjamAPI.getHeatmap($scope.startDate, $scope.endDate)
                        .then(function (data) {
                            $scope.toggleClass = 'btn-success';
                            var cleanedData = stripNulls(data.data);
                            generateMapData(cleanedData);
                            timeframeEnabled = true;
                            dateChanged = false;
                        },
                        function (data) {
                            console.log('heat map failed to get words hard');
                        });
                } else {
                    timeframeEnabled = true;
                    generateMapData(dataCache);
                }
            }
        };


        var stripNulls = function(data) {
            var newArray = [];
            data.forEach(function (item) {
                if(item.latitude  && item.longitude) {
                    newArray.push(item);
                }
            });

            return newArray;
        };
        var intersections = [];
        var dataCache;

        $scope.$watch('color', function (newVal, oldVal) {
            if(oldVal) {
                updateColor(newVal);
            }
        });
        var updateColor = function (color) {
            intersections.forEach(function (intersection) {
                intersection.setOptions({
                    fillColor: color,
                    strokeColor: color
                });

            });
        };

        var generateMapData = function (data) {
            console.log(data);
            dataCache = data;
            data.forEach(function (item) {
                var intersectionCircle = new google.maps.Circle({
                    strokeColor: $scope.color,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: $scope.color,
                    fillOpacity: 0.35,
                    map: map,
                    center: new google.maps.LatLng(item.latitude, item.longitude),
                    radius: item.normalizedSum
                });

                intersections.push(intersectionCircle);
            });
        };

        var clearMapData = function () {
            intersections.forEach(function (mapItem) {
               mapItem.setMap(null);
            });
            intersections = [];
        };

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };



        $scope.openStart = function($event) {
            $scope.status.startOpened = true;
        };

        $scope.openEnd = function($event) {
            $scope.status.endOpened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };


        $scope.status = {
            startOpened: false,
            endOpened:false

        };


    });

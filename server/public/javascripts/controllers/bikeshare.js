'use strict';

angular.module('trafficjam')
    .controller('BikeShareCtrl', function ($scope, $document, TrafficjamAPI, MapService) {
        var isBikeActive = false;
        $scope.btnActiveClass = "btn-default";
        $scope.toggleBikeShare = function () {
            if(isBikeActive) {
                $scope.btnActiveClass = "btn-default";
                isBikeActive = false;
                clearBikeData();
            } else {
                TrafficjamAPI.getBikeShare()
                    .then(function (data) {
                        showBikeData(data);
                    },
                    function (data) {
                        console.log('bike map failed to get words hard');
                    });
                $scope.btnActiveClass = "btn-success";
                isBikeActive = true;
            }




        };

        var map = MapService.getMap();
        var bikePins = [];
        var showBikeData = function (data) {

                data.forEach(function(bikeItem) {
                    var image = 'images/bike.png';
                    var bikeMarker = new google.maps.Marker({
                        position: {lat: bikeItem.latitude, lng: bikeItem.longitude},
                        map: map,
                        icon: image
                    });
                    bikePins.push(bikeMarker);
                });
        }

        var clearBikeData = function () {
            bikePins.forEach(function (bikePin) {
                bikePin.setMap(null);

            });
            bikePins = [];
        }


    });

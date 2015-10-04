angular.module('trafficjam')
    .service('MapService', function MapService($http, $document) {
        var map;
        var mapService = {
            getMap: function () {
                if(!map) {
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: {lat: 43.0, lng: -79.0},
                        zoom: 8
                    });
                }
                return map;
            }
        }

        return mapService;
    });
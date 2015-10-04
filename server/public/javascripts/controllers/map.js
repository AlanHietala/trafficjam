'use strict';

angular.module('trafficjam')
    .controller('MapCtrl', function ($scope, $document, TrafficjamAPI) {

        $scope.timeframes = [{test:'something'}];
        $scope.addTimeframe = function () {
            $scope.timeframes.push({});
        };




    });

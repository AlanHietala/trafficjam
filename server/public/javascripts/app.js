'use strict';
angular.module('trafficjam', [ 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/map.html',
                controller: 'MapCtrl'
            });
    });
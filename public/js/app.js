/*globals angular */
'use strict';

angular.module('afsApp', [
    //libraries
    'ngRoute',
    'ngCookies',
    'ui.bootstrap',

    // Serivces
    'UserService',
    'Authentication',

    //Controller
    'NavController',
    'FormController',
    'UserController'
]);

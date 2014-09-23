/*globals angular */
'use strict';

angular.module('afsApp', [
    //libraries
    'ngRoute',
    'ngCookies',
    'ngClipboard',
    'ui.bootstrap',

    // Serivces
    'UserService',
    'Authentication',
    'QuestionService',

    //Controller
    'NavController',
    'FormController',
    'UserController',
    'HomeController'
]);

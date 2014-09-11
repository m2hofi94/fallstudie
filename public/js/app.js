/*globals angular */
'use strict';

angular.module('afsApp', [
    'ngRoute',
    'ui.bootstrap',
    'UserService',
    'NavController',
    'UserController'
])

.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'NavCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'UserCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'UserCtrl'
            })
            .when('/users', {
                templateUrl: 'views/users.html',
                controller: 'UserCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
}]);

/*globals angular */
'use strict';


angular.module('afsApp').config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
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
                controller: 'UserCtrl',
				protected: true
            })
			.when('/surveys', {
				templateUrl: 'views/surveys.html',
                controller: 'FormCtrl',
				protected: true
			})
            .when('/surveys/edit', {
				templateUrl: 'views/surveys/edit-field.html',
                controller: 'FormCtrl',
				protected: true
			})
            .when('/surveys/view', {
				templateUrl: 'views/surveys/view-field.html',
                controller: 'FormCtrl',
				protected: true
			})
			.when('/contact', {
				templateUrl: 'views/contact.html',
                controller: 'UserCtrl'
			})
            .otherwise({
                redirectTo: '/'
            });
}]);

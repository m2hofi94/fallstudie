/*globals angular */
'use strict';


angular.module('afsApp').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                protected: true
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'UserCtrl',
                hideIfLoggedIn: true
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'UserCtrl',
                hideIfLoggedIn: true
            })
            .when('/users', {
                templateUrl: 'views/users.html',
                controller: 'UserCtrl',
				protected: true
            })
			.when('/newSurvey', {
				templateUrl: 'views/newSurvey.html',
                controller: 'FormCtrl',
				protected: true
			})
            .when('/preview', {
				templateUrl: 'views/preview.html',
                controller: 'FormCtrl',
				protected: true
			})
			.when('/contact', {
				templateUrl: 'views/contact.html',
                controller: 'UserCtrl'
			})
            .when('/publish/:token', {
                templateUrl: 'views/publish.html',
                controller: 'AnswerCtrl',
                protected: true
            })
            .when('/main', {
                templateUrl: 'views/main.html',
                // controller: 'MainCtrl'
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'UserCtrl',
                protected: true
            })
            .when('/participate/:token',{
                templateUrl: 'views/participate.html',
                controller: 'AnswerCtrl'
            })
            .when('/noSurvey',{
                templateUrl: 'views/surveys/noSurvey.html',
                controller: 'AnswerCtrl'
            })
            .when('/thanks',{
                templateUrl: 'views/surveys/thanks.html',
                controller: 'AnswerCtrl'
            })
            .when('/results/:token/:title',{
                templateUrl: 'views/surveys/results.html',
                controller: 'AnswerCtrl'
            })
            .otherwise({
                redirectTo: '/login'
            });
}]);

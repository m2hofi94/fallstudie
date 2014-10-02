/*globals angular */
'use strict';

angular.module('afsApp', [
    //libraries
    'ngRoute',
    'ngCookies',
    'ngClipboard',
    'ui.bootstrap',
    'xeditable',
    'ngTagsInput',

    // Serivces
    'UserService',
    'Authentication',
    'SurveyService',

    //Controller
    'NavController',
    'FormController',
    'UserController',
    'HomeController',
    'AnswerController'
]);

angular.module('afsApp').run(['editableOptions', function(editableOptions) {
    editableOptions.theme = 'bs3';
}]);

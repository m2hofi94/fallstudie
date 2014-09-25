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
    'QuestionService',

    //Controller
    'NavController',
    'FormController',
    'UserController',
    'HomeController'
]);

angular.module('afsApp').run(['editableOptions', function(editableOptions) {
    editableOptions.theme = 'bs3';
}]);

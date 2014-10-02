/*globals angular */
'use strict';

angular.module('AnswerController', []).controller('AnswerCtrl', ['$scope', '$routeParams', 'Surveys', '$location', function ($scope, $routeParams, Surveys, $location) {
    $scope.token = $routeParams.token;

    $scope.getSurveys = function (){
         Surveys.getQuestionsWithToken($scope.token).success(function(data) {
            console.log(data);
            $scope.fields = data[1];
            $scope.title = data[0];
        }).error(function(err) {
            console.log(err);
        });
    };
    $scope.getSurveys();

}]);

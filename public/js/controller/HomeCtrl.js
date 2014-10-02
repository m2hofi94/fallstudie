/*globals angular */
'use strict';

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', 'Surveys', '$http', '$location', function($scope, Surveys, $http, $location) {
    $scope.dynamic = 25;
    $scope.max = 50;
    $scope.isCollapsed = true;
    $scope.status = [
        {type : 'draft', name : 'Entwurf'},
        {type : 'active', name : 'Laufende Umfragen'},
        {type : 'closed', name : 'Beendete Umfragen'}
    ];

    $scope.toggleCollapse = function (){
        $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.go = function ( path ) {
        $location.url( path );
    };

    $scope.getSurveys = function (){
         Surveys.getSurveys().success(function(data) {
            $scope.surveys = data;
        }).error(function(err) {
            console.log(err);
        });
    };
    $scope.getSurveys();

    $scope.listSurveys = function(type){
        if (typeof($scope.surveys) != "undefined"){
            var list = [];
            for(var i = 0; i < $scope.surveys.length; i++){
                if($scope.surveys[i].status == type)
                    list.push($scope.surveys[i]);
            }
            return list;
        }
    };
    $scope.drafts = $scope.listSurveys('draft');
    $scope.activeSurveys = $scope.listSurveys('active');
    $scope.closedSurveys = $scope.listSurveys('closed');


    $scope.edit = function(survey){

    };

    $scope.activate = function(survey){
            Surveys.activateSurvey(survey.id)
            .success(function(data){
                console.log(survey.id);
                Surveys.publishSurvey(survey.id).success(function(data){
                    $scope.tokenUrl = 'localhost:61701/#/participate/' + data.insertId;
                    console.log($scope.tokenUrl);
                    $location.url('/home');
                }).error(function(err){

                });
            }).error(function(err){
                    console.log(err);
            });
            $scope.toggleCollapse();
    };

    $scope.delete = function(survey){
        Surveys.deleteSurvey(survey.id)
            .success(function(data){
                // console.log(data);
            }).error(function(err){
                    console.log(err);
            });
            $scope.toggleCollapse();
    };

}]);

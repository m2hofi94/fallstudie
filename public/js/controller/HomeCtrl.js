/*globals angular */
'use strict';

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', 'Surveys', '$http', '$location', function($scope, Surveys, $http, $location) {
    $scope.dynamic = 25;
    $scope.max = 50;
    // in [0] = Title of Table; [1] = survey + isCollapsed variable
    $scope.sortedSurveys = [['Entwurf', []],['Laufende Umfragen', []],['Beendete Umfragen' ,[]]];

    $scope.toggleCollapse = function (survey){
        survey.isCollapsed = !survey.isCollapsed;
    };

    $scope.go = function ( path ) {
        $location.url( path );
    };

    $scope.getSurveys = function (){
        // Get all Surveys for specific user
         Surveys.getSurveys().success(function(data) {
            $scope.surveys = data;
             // Depending on status the survey is saved in the approriate index in the sortedSurveys-Array
            for(var i = 0; i < $scope.surveys.length; i++){
                if($scope.surveys[i].status == 'draft')
                    $scope.sortedSurveys[0][1].push({data:$scope.surveys[i], isCollapsed : true});
                else if($scope.surveys[i].status == 'active')
                    $scope.sortedSurveys[1][1].push({data:$scope.surveys[i], isCollapsed : true});
                else if($scope.surveys[i].status == 'closed')
                    $scope.sortedSurveys[2][1].push({data:$scope.surveys[i], isCollapsed : true});
            }
        }).error(function(err) {
            console.log(err);
        });
    };
    $scope.getSurveys();

    $scope.edit = function(survey){

    };

    $scope.viewResults = function(survey){

    };

    $scope.close = function(survey){
        // Update field status in table surveys
        Surveys.changeStatus(survey.data.id, 'closed')
        .success(function(data){
            $scope.loadData();
            // Later Function "close" may be integrated in viewResults (or vice versa)
            // View Results
        }).error(function(err){
                console.log(err);
        });
    };

    $scope.activate = function(survey){
        // Update field status in table surveys
        Surveys.changeStatus(survey.data.id, 'active')
        .success(function(data){
            // Save surveyID in table tokens and return token ( in this case the ID )
            Surveys.publishSurvey(survey.data.id).success(function(data){
                $location.url('/publish/' + data.insertId);
             }).error(function(err){

             });

        }).error(function(err){
                console.log(err);
        });
    };

    $scope.delete = function(survey){
        // Delete Survey in surveys, and delete entries in tokens and questions
        Surveys.deleteSurvey(survey.data.id)
            .success(function(data){
                $scope.loadData();
            }).error(function(err){
                    console.log(err);
            });

    };

    $scope.loadData = function () {
        // reload data after clicking one button ( in the current state only "Delete" )
        $scope.sortedSurveys = [['Entwurf', []],['Laufende Umfragen', []],['Beendete Umfragen' ,[]]];
        $scope.getSurveys();
    };

}]);

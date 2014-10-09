/*globals angular */
'use strict';

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', 'Surveys', '$http', '$location',
    function ($scope, Surveys, $http, $location) {
        Surveys.idToEdit = -1;
        $scope.dynamic = 0;
        $scope.max = 50;
        $scope.activeSurvey = {
            isCollapsed: true
        };
        // in [0] = Title of Table; [1] = survey + isCollapsed variable
        $scope.sortedSurveys = [['Entwurf', []], ['Laufende Umfragen', []], ['Beendete Umfragen', []]];

        $scope.toggleCollapse = function (survey) {
            survey.isCollapsed = !survey.isCollapsed;
            // If is needed because you may click on the same survey more often
            // in this case the survey would be isCollapsed = true forever
            if ($scope.activeSurvey != survey) {
                $scope.activeSurvey.isCollapsed = true;
                $scope.activeSurvey = survey;
            }
        };

        $scope.go = function (path) {
            $location.url(path);
        };

        $scope.getSurveys = function () {
            // Get all Surveys for specific user
            Surveys.getSurveys().success(function (data) {
                $scope.surveys = data;
                // Depending on status the survey is saved in the approriate index in the sortedSurveys-Array
                for (var i = 0; i < $scope.surveys.length; i++) {
                    var date = new Date(data[i].created);
                    $scope.surveys[i].start  = date.toLocaleDateString();
                    date = new Date(data[i].endDate);
                    $scope.surveys[i].end = date.toLocaleDateString();

                    if ($scope.surveys[i].status == 'draft')
                        $scope.sortedSurveys[0][1].push({
                            data: $scope.surveys[i],
                            isCollapsed: true
                        });
                    else if ($scope.surveys[i].status == 'active'){
                        $scope.sortedSurveys[1][1].push({
                                data: $scope.surveys[i],
                                isCollapsed: true
                            });
                        if(date > new Date(0) && date < new Date()){
                            // close latest entry in sortedSurveys[1][1]
                            $scope.close($scope.sortedSurveys[1][1].length-1);

                        }
                    } else if ($scope.surveys[i].status == 'closed')
                        $scope.sortedSurveys[2][1].push({
                            data: $scope.surveys[i],
                            isCollapsed: true
                        });
                }
            }).error(function (err) {
                console.log(err);
            });
        };
        $scope.getSurveys();

        $scope.edit = function (index) {
            var surveys = $scope.sortedSurveys[0][1];
            Surveys.idToEdit = surveys[index].data.id;
            Surveys.tempTitle = surveys[index].data.title;
            $location.url('/newSurvey');
        };

        $scope.viewResults = function (index) {
            var surveys = $scope.sortedSurveys[2][1];
            $location.url('/results/' + surveys[index].data.id + '/' + surveys[index].data.title);
        };

        $scope.close = function (index) {
            // Update field status in table surveys
            var surveys = $scope.sortedSurveys[1][1];

            Surveys.changeStatus(surveys[index].data.id, 'closed')
                .success(function (data) {
                    surveys[index].data.end = new Date().toLocaleDateString();
                    $scope.sortedSurveys[2][1].push(surveys[index]);
                    surveys[index].isCollapsed = true;
                    $scope.sortedSurveys[1][1].splice(index, 1);
                    // Later Function "close" may be integrated in viewResults (or vice versa)
                    // View Results
                }).error(function (err) {
                    console.log(err);
                });
        };

        $scope.activate = function (index) {
            // Update field status in table surveys
            var surveys = $scope.sortedSurveys[0][1];
            Surveys.changeStatus(surveys[index].data.id, 'active')
                .success(function (data) {
                    // Save surveyID in table tokens and return token ( in this case the ID )
                    Surveys.publishSurvey(surveys[index].data.id).success(function (data) {
                        console.log(data);
                        if(data === '"No Recipients"'){
                            Surveys.publishSurveyOpen(surveys[index].data.id).success(function (data) {
                                console.log(data);
                                data = data.replace('"','');
                                data = data.replace('"','');
                                $location.url('/publish/' + data);
                            }).error(function(err){
                                console.log(err);
                            });
                        } else {
                        //   /* If publishing to e-Mails
                        $scope.sortedSurveys[1][1].push(surveys[index]);
                        surveys[index].isCollapsed = true;
                        //    */
                        }
                        $scope.sortedSurveys[0][1].splice(index, 1);
                    }).error(function (err) {

                    });

                }).error(function (err) {
                    console.log(err);
                });
        };

        $scope.restart = function (index){
            Surveys.restart = true;
            var surveys = $scope.sortedSurveys[2][1];
            Surveys.idToEdit = surveys[index].data.id;
            Surveys.tempTitle = surveys[index].data.title;
            $location.url('/newSurvey');
        };

        $scope.delete = function (firstIndex, secondIndex) {
            // Delete Survey in surveys, and delete entries in tokens and questions
            var surveys = $scope.sortedSurveys[firstIndex][1];
            Surveys.deleteSurvey(surveys[secondIndex].data.id)
                .success(function (data) {
                    $scope.sortedSurveys[firstIndex][1].splice(secondIndex, 1);
                }).error(function (err) {
                    console.log(err);
                });
        };

}]);

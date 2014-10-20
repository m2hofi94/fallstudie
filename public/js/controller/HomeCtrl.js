/*globals angular */
'use strict';

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', 'Surveys', '$modal', '$http', '$location', '$timeout',
    function ($scope, Surveys, $modal, $http, $location, $timeout) {
        $scope.baseUrl = $location.$$absUrl.replace('home', 'participate/');
		console.log($scope.baseUrl);
		Surveys.idToEdit = -1;
		$scope.activeSurvey= {
			isCollapsed: false
		};
		$scope.oldSurvey= {
			isCollapsed: false
		};
        // in [0] = Title of Table; [1] = survey + isCollapsed variable
        $scope.sortedSurveys = [['Entwurf', []], ['Laufende Umfragen', []], ['Beendete Umfragen', []]];

        $scope.toggleCollapse = function (survey) {
			if ($scope.activeSurvey != survey) {
				$scope.oldSurvey = $scope.activeSurvey;
				$scope.activeSurvey = survey;
				$timeout(function() {
					$scope.activeSurvey.isCollapsed = !$scope.activeSurvey.isCollapsed;
				},500);
				$scope.oldSurvey.isCollapsed = !$scope.oldSurvey.isCollapsed;
			}
        };

        $scope.go = function (path) {
            $location.url(path);
        };

        $scope.getSurveys = function () {
            // Get all Surveys for specific user
            Surveys.getSurveys().success(function (data) {
                // console.log(data);
                //$scope.surveys = data.surveys;
                $scope.surveys = data; // {id, userID, status, title, countRecipients, countAnswers, endDate, created}
                // Depending on status the survey is saved in the approriate index in the sortedSurveys-Array
                for (var i = 0; i < $scope.surveys.length; i++) {
                    var openSurvey = $scope.surveys[i].countRecipients === 0 ? true : false;

                    $scope.surveys[i].start  = new Date($scope.surveys[i].created).toLocaleDateString();
                    $scope.surveys[i].end = new Date($scope.surveys[i].endDate).toLocaleDateString();

                    // $scope.surveys[i].countOfAnswers = Surveys.getCountOfAnswers($scope.surveys[i].id);
                    if ($scope.surveys[i].status == 'draft')
                        $scope.sortedSurveys[0][1].push({
                            data: $scope.surveys[i],
                            isCollapsed: true,
                        });
                    else if ($scope.surveys[i].status == 'active'){
                        $scope.sortedSurveys[1][1].push({
                                data: $scope.surveys[i],
                                isCollapsed: true,
                                open : openSurvey
                            });
                        if(($scope.surveys[i].end > new Date(0) && $scope.surveys[i].end < new Date()) || (!openSurvey && ($scope.surveys[i].countRecipients == $scope.surveys[i].countAnswers))){
                            console.log(data);
                            console.log("close " + openSurvey + ' . ' + $scope.surveys[i].countRecipients);
                            // close latest entry in sortedSurveys[1][1]
                            $scope.close($scope.sortedSurveys[1][1].length-1);
                        }
                    } else if ($scope.surveys[i].status == 'closed')
                        $scope.sortedSurveys[2][1].push({
                            data: $scope.surveys[i],
                            isCollapsed: true,
                            open : openSurvey
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
		console.log('about to delete');
			var modalInstance = $modal.open({
            template: '<div class="modal-body"><p>M&ouml;chten Sie die Umfrage endg&uuml;ltig l&ouml;schen?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-danger" ng-click="$close()">OK</button></div>',
            size: 'sm',
            scope: $scope
        });

        modalInstance.result.then(function () {
            var surveys = $scope.sortedSurveys[firstIndex][1];
            Surveys.deleteSurvey(surveys[secondIndex].data.id)
                .success(function (data) {
                    console.log("Delete");
                    $scope.alert = 'Die Umfrage wurde erfolgreich gelöscht';
                    $scope.sortedSurveys[firstIndex][1].splice(secondIndex, 1);
                }).error(function (err) {
                    console.log(err);
                });
           }, function () {
               console.log('Modal dismissed at: ' + new Date());
           });
        };

}]);


/* Surveys with Recipient/Answer model
$scope.getSurveys = function () {
            // Get all Surveys for specific user
            Surveys.getSurveys().success(function (data) {
                // console.log(data);
                //$scope.surveys = data.surveys;
                $scope.surveys = data; // {id, userID, status, title, countRecipients, countAnswers, endDate, created}
                // Depending on status the survey is saved in the approriate index in the sortedSurveys-Array
                for (var i = 0; i < $scope.surveys.length; i++) {
                    var openSurvey = false;
                    if(data.count.recipients[i] === 0){
                        console.log(i + ': rec = 0');
                        data.count.recipients[i] = data.count.answers[i];
                        openSurvey = true;
                    }
                    var date = new Date($scope.surveys[i].created);
                    $scope.surveys[i].start  = date.toLocaleDateString();
                    date = new Date($scope.surveys[i].endDate);
                    $scope.surveys[i].end = date.toLocaleDateString();

                    // $scope.surveys[i].countOfAnswers = Surveys.getCountOfAnswers($scope.surveys[i].id);
                    if ($scope.surveys[i].status == 'draft')
                        $scope.sortedSurveys[0][1].push({
                            data: $scope.surveys[i],
                            isCollapsed: true,
                        });
                    else if ($scope.surveys[i].status == 'active'){
                        $scope.sortedSurveys[1][1].push({
                                data: $scope.surveys[i],
                                isCollapsed: true,
                                recipients: data.count.recipients[i],
                                answers: data.count.answers[i],
                                open : openSurvey
                            });
                        if((date > new Date(0) && date < new Date()) || (!openSurvey && (data.count.recipients[i] == data.count.answers[i]))){
                            // close latest entry in sortedSurveys[1][1]
                            $scope.close($scope.sortedSurveys[1][1].length-1);
                        }
                    } else if ($scope.surveys[i].status == 'closed')
                        $scope.sortedSurveys[2][1].push({
                            data: $scope.surveys[i],
                            isCollapsed: true,
                            recipients: data.count.recipients[i],
                            answers: data.count.answers[i],
                            open : openSurvey
                        });
                }
            }).error(function (err) {
                console.log(err);
            });
        };
    */

/*globals angular */
'use strict';

/**
 * Controller is used for the '/home' view
 * Is responsible for listing and editing the status of the surveys
 */

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', 'Surveys', '$modal', '$http', '$location', '$timeout',
    function ($scope, Surveys, $modal, $http, $location, $timeout) {
		$scope.baseUrl = $location.$$absUrl.replace('home', 'participate/');
		Surveys.idToEdit = -1;

        // Every listed survey gets an "isCollapsed"-Boolean variable which handles the visibility of the menubar
		$scope.activeSurvey = {
			data: {
				id: 0
			},
			isCollapsed: false
		};
		$scope.oldSurvey = {
			isCollapsed: false
		};

		// in [0] = Title of Table; [1] = survey + isCollapsed variable
		$scope.sortedSurveys = [['Entwurf', []], ['Laufende Umfragen', []], ['Beendete Umfragen', []]];

		$scope.toggleCollapse = function (survey) {
			if ($scope.activeSurvey.data.id != survey.data.id) {
				$scope.activeSurvey.isCollapsed = true;
				$scope.activeSurvey = survey;
				$timeout(function () {
					$scope.activeSurvey.isCollapsed = !$scope.activeSurvey.isCollapsed;
				}, 500);
			} else {
				$scope.activeSurvey.isCollapsed = true;
				$scope.activeSurvey = {
					data: {
						id: 0
					}
				};
			}
		};

        // Used for clicks on buttons which need to load another page
		$scope.go = function (path) {
			$location.url(path);
		};

		//used to get bit.ly-link and qr-code
		$scope.gotoLinks = function(token) {
			$location.url('publish/'+token);
		};

		// Get all Surveys for specific user
		$scope.getSurveys = function () {
			$scope.loading = true;

			Surveys.getSurveys().success(function (data) {
				$scope.surveys = data; // {id, userID, status, title, countRecipients, countAnswers, endDate, created}
				// Depending on status the survey is saved in the approriate index in the sortedSurveys-Array
				for (var i = 0; i < $scope.surveys.length; i++) {
					var openSurvey = $scope.surveys[i].countRecipients === 0 ? true : false;

                    // Format start and end Date string
					$scope.surveys[i].start = new Date($scope.surveys[i].created).toLocaleDateString();
					$scope.surveys[i].end = new Date($scope.surveys[i].endDate).toLocaleDateString();

					if ($scope.surveys[i].status == 'draft')
						$scope.sortedSurveys[0][1].push({
							data: $scope.surveys[i],
							isCollapsed: true,
						});
					else if ($scope.surveys[i].status == 'active') {
						$scope.sortedSurveys[1][1].push({
							data: $scope.surveys[i],
							isCollapsed: true,
							open: openSurvey
						});
                        // If an active Survey has no more recipients left who didn't take part yet the survey is closed
						if (!openSurvey && ($scope.surveys[i].countRecipients == $scope.surveys[i].countAnswers)) {
							// close latest entry in sortedSurveys[1][1]
							$scope.close($scope.sortedSurveys[1][1].length - 1);
						}
					} else if ($scope.surveys[i].status == 'closed')
						$scope.sortedSurveys[2][1].push({
							data: $scope.surveys[i],
							isCollapsed: true,
							open: openSurvey
						});
				}
				$scope.loading = false;
			}).error(function (err) {
				console.log(err);
				$scope.loading = false;
			});
		};
		$scope.getSurveys();

        // Edit a draft survey and redirect to '/newSurvey' view
		$scope.edit = function (index) {
			var surveys = $scope.sortedSurveys[0][1];
			Surveys.idToEdit = surveys[index].data.id;
			Surveys.tempTitle = surveys[index].data.title;
			$location.url('/newSurvey');
		};

        // View survey results of selected survey
		$scope.viewResults = function (index) {
			var surveys = $scope.sortedSurveys[2][1];
			$location.url('/results/' + surveys[index].data.id + '/' + surveys[index].data.title);
		};

        // Update field status in table surveys
		$scope.close = function (index) {
			var surveys = $scope.sortedSurveys[1][1];

			Surveys.changeStatus(surveys[index].data.id, 'closed')
				.success(function (data) {
                    // End date is current Date
					surveys[index].data.end = new Date().toLocaleDateString();
                    // survey is now listed as 'closed'
					$scope.sortedSurveys[2][1].push(surveys[index]);
					$scope.sortedSurveys[1][1].splice(index, 1);

                    // Collapse menubar
                    surveys[index].isCollapsed = true;
                    $scope.activeSurvey.isCollapsed = true;
                    $scope.activeSurvey = {
                        data: {
                            id: 0
                        }
                    };
				}).error(function (err) {
					console.log(err);
				});
		};

        // Change Status from 'draft' to 'acitve'
		$scope.activate = function (index) {
			var surveys = $scope.sortedSurveys[0][1];

			Surveys.changeStatus(surveys[index].data.id, 'active')
				.success(function (data) {
					// Save surveyID in table tokens and return token ( in this case the ID )
					Surveys.publishSurvey(surveys[index].data.id).success(function (data) {
                        // If there are no recipients, survey is published to everyone, otherwise E-Mails are sent
						if (data === 'No Recipients') {
							Surveys.publishSurveyOpen(surveys[index].data.id).success(function (data) {
								$location.url('/publish/' + data);
							}).error(function (err) {
								console.log(err);
							});
						} else {
							$scope.sortedSurveys[1][1].push(surveys[index]);
							surveys[index].isCollapsed = true;
						}
						$scope.sortedSurveys[0][1].splice(index, 1);
					});
				});
		};

        // Restarte closed survey, load '/newSurvey' view with old questions and recipients
		$scope.restart = function (index) {
			Surveys.restart = true;
			var surveys = $scope.sortedSurveys[2][1];
            // Surveys-Service is used to transfer data between two different controller without having to use a http request
			Surveys.idToEdit = surveys[index].data.id;
			Surveys.tempTitle = surveys[index].data.title;
			$location.url('/newSurvey');
		};

        // Delete survey, but ask if user is really sure about it
		$scope.delete = function (firstIndex, secondIndex) {
			console.log('about to delete');
			var modalInstance = $modal.open({
				template: '<div class="modal-body"><p>M&ouml;chten Sie die Umfrage endg&uuml;ltig l&ouml;schen?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-success" ng-click="$close()">OK</button></div>',
				size: 'sm',
				scope: $scope
			});

			modalInstance.result.then(function () {
				var surveys = $scope.sortedSurveys[firstIndex][1];
				Surveys.deleteSurvey(surveys[secondIndex].data.id).success(function (data) {
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

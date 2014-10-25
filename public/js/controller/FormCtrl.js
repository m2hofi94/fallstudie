/*globals angular */
'use strict';
/**
Controller is used to create a new survey, restart an old one and edit questions of the survey
*/

angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Surveys', 'Authentication', '$modal', '$location', '$window',
	function ($scope, Surveys, Authentication, $modal, $location, $window) {
		$scope.init = function () {
			$scope.checkMessage = '';
			$scope.authentication = Authentication;

			$scope.title = '';
			$scope.emails = '';
			// Standard Value for new survey
			$scope.standardQuestions = [
				{
					title: 'Wie fanden Sie die Veranstaltung?',
					type: 'Slider',
					rate: 6,
					input: ''
            },
				{
					title: 'Bitte begründen Sie Ihre Antwort',
					type: 'TextArea',
					rate: 6,
					input: ''
            }
        ];

			$scope.options = [
				{
					type: 'Slider',
					value: 'Skala'
            },
				{
					type: 'TextArea',
					value: 'Textfeld'
            }
        ];

            // Check if the current survey is already one which is saved as 'draft' or if it is a new one
            // draft => (idToEdit != -1) == true;
            // If it is a new one, the standardQuestions are loaded
			if (Surveys.idToEdit != -1) {
				$scope.toEdit = true;
				$scope.title = Surveys.tempTitle;
				$scope.edit(Surveys.idToEdit);
			} else {
				$scope.fields = $scope.standardQuestions.slice();
			}
		};

		$scope.addQuestion = function () {
			$scope.fields.push({
				title: '',
				type: 'TextArea',
				rate: 6,
				input: ''
			});
		};

		$scope.removeQuestion = function (index) {
			$scope.fields.splice(index, 1);
		};

        // If user wants to edit a survey, the questions are loaded from the DB
		$scope.edit = function (id) {
			$scope.loading = true;
			Surveys.getQuestions(id)
				.success(function (data) {
					$scope.fields = data;
					for (var i = 0; i < $scope.fields; i++) {
                        // Set standard value for Slider-Fields (used in preview-view)
						if ($scope.fields[i].type === 'Slider') {
							$scope.fields[i].rate = 6;
						}
					}
					Surveys.getRecipients(id)
						.success(function (data) {
							var mail = data;
							for (var i = 0; i < mail.length; i++) {
								$scope.emails += mail[i].email + ';';
							}
							$scope.loading = false;

						}).error(function (err) {
							console.log(err);
						});

				}).error(function (err) {
					console.log(err);
				});
		};

        // Submit the survey and send E-Mails
		$scope.submit = function (status) {
			if ($scope.checkFields()) {
                // Send E-Mails if there are recipients, or publish for everyone
				if ($scope.emails !== '') {
					$scope.recipient = $scope.emails.split(';');
					$scope.deletedEmails = [];
					for (var i = 0; i < $scope.recipient.length; i++) {
                        // Remove spaces and verify inserted E-Mail Adresses with RegEx
						$scope.recipient[i] = $scope.recipient[i].replace(/(^\s+|\s+$)/g, '');
						if (!$scope.recipient[i].match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
							$scope.deletedEmails.push($scope.recipient.splice(i, 1));
							i--;
						}

					}

                    // Check for duplicate E-Mail entries
                    var tmp = [];
					for (i=0; i<$scope.recipient.length; i++) {
						var unique = true;
						for (var j=i+1; j<$scope.recipient.length; j++) {
							if ($scope.recipient[i] == $scope.recipient[j]) {
								unique = false;
							}
						}
						if (unique) {
							tmp.push($scope.recipient[i]);
						}
					}
					$scope.recipient = tmp.slice();

					$scope.submitToDb(status);
				} else {
					var later = status == 'draft' ? 'sp&auml;ter' : '';
					var modalInstance = $modal.open({
						template: '<div class="modal-body"><p>Es wurden keine Teilnehmer angegeben. M&ouml;chten Sie die Umfrage ' + later + ' f&uuml;r jeden freischalten?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-success" ng-click="$close()">OK</button></div>',
						size: 'sm',
						scope: $scope
					});

					modalInstance.result.then(function () {
						$scope.submitToDb(status);
					}, function () {
						console.log('Modal dismissed at: ' + new Date());
					});
				}
			}
		};

        // Called from submit() after checking inputs and recipients
		$scope.submitToDb = function (status) {
            // if survey used to be in draft status, delete old survey, and create new one with updated questions and status
			if (Surveys.idToEdit != -1 && !Surveys.restart) {
				Surveys.deleteSurvey(Surveys.idToEdit).success(function (data) {}).error(function (data) {});
				Surveys.idToEdit = -1;
			}

			Surveys.restart = false;
			$scope.survey = [$scope.title, $scope.fields, status, $scope.recipient];
            // Create and (if necessary) publish survey
			Surveys.createSurvey($scope.survey).success(function (data) {
				if (status == 'draft') {
					$location.url('/home');
				} else {
					if ($scope.emails !== '') {
						Surveys.publishSurvey(data.insertId).success(function (data) {
							$location.url('/home');
						}).error(function (err) {
							console.log(err);
						});
					} else {
						Surveys.publishSurveyOpen(data.insertId).success(function (data) {
							$location.url('/publish/' + data);
						}).error(function (err) {
							console.log(err);
						});
					}

				}
			}).error(function (err) {

			});
		};

        // Click on Preview / Back button
		$scope.togglePreview = function () {
			if ($scope.checkFields()) {
				$scope.preview = !$scope.preview;
				$window.scrollTo(0,0);
			}

		};

        // Check if survey has a title, and at least one question
		$scope.checkFields = function () {
			if ($scope.title === '') {
				$scope.checkMessage = 'Titel der Umfrage darf nicht leer sein';
				return false;
			} else if ($scope.fields.length === 0) {
				$scope.checkMessage = 'Die Umfrage muss mindestens eine Frage enthalten';
				return false;
			} else {
				for (var i = 0; i < $scope.fields.length; i++) {
					if ($scope.fields[i].title === '') {
						$scope.checkMessage = 'Jede Frage muss einen Titel enthalten';
						return false;
					}
				}
				return true;
			}
		};

        // Cancel transaction, do not transmit any changes
		$scope.cancel = function () {
			Surveys.idToEdit = -1;
			$location.url('/home');
		};

		$scope.init();
}]);


/*     // In a future state one could implement the funcionality to start/end a survey on a specific date
       // This code may be useful

       // DATEPICKER

		$scope.today = function (date) {
			date = new Date();
		};

		$scope.toggleMin = function () {
			$scope.minDate = $scope.minDate ? null : new Date();
		};

		$scope.open = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();

			if ($event.target.id === 'btnStart') {
				$scope.openedStart = !$scope.openedStart;
			} else {
				$scope.openedEnd = !$scope.openedEnd;
			}
		};

        $scope.date = [
				{
					value: new Date()
				},
				{
					value: new Date()
				}
        ];
			$scope.today();
			$scope.toggleMin();

*/

/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Surveys', 'Authentication', '$modal', '$location',
	function ($scope, Surveys, Authentication, $modal, $location) {
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

			// Date Picker
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

			if (Surveys.idToEdit != -1) {
				$scope.toEdit = true;
				$scope.title = Surveys.tempTitle;
				$scope.edit(Surveys.idToEdit);
			} else {
				$scope.fields = $scope.standardQuestions.slice();
			}
		};

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

		$scope.edit = function (id) {
			Surveys.getQuestions(id)
				.success(function (data) {
					$scope.fields = data;
					for (var i = 0; i < $scope.fields; i++) {
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

						}).error(function (err) {
							console.log(err);
						});

				}).error(function (err) {
					console.log(err);
				});
		};

		$scope.submit = function (status) {
			if ($scope.checkFields()) {
				if ($scope.emails !== '') {
					$scope.recipient = $scope.emails.split(';');
					$scope.deletedEmails = [];
					for (var i = 0; i < $scope.recipient.length; i++) {
						$scope.recipient[i] = $scope.recipient[i].replace(/(^\s+|\s+$)/g, '');
						if (!$scope.recipient[i].match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
							$scope.deletedEmails.push($scope.recipient.splice(i, 1));
							i--;
						}

					}
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
					console.log(status);
					var later = status == 'draft' ? 'sp&auml;ter' : '';
					var modalInstance = $modal.open({
						template: '<div class="modal-body"><p>Es wurden keine Teilnehmer angegeben. Möchten Sie die Umfrage ' + later + ' für jeden freischalten?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-danger" ng-click="$close()">OK</button></div>',
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

		$scope.submitToDb = function (status) {
			if (Surveys.idToEdit != -1 && !Surveys.restart) {
				Surveys.deleteSurvey(Surveys.idToEdit).success(function (data) {}).error(function (data) {});
				Surveys.idToEdit = -1;
			}
			Surveys.restart = false;
			$scope.survey = [$scope.title, $scope.fields, status, $scope.recipient];
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
							data = data.replace('"', '');
							data = data.replace('"', '');
							$location.url('/publish/' + data);
						}).error(function (err) {
							console.log(err);
						});
					}

				}
			}).error(function (err) {

			});
		};

		$scope.togglePreview = function () {
			if ($scope.checkFields())
				$scope.preview = !$scope.preview;

		};

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

		$scope.cancel = function () {
			Surveys.idToEdit = -1;
			$location.url('/home');
		};

		$scope.init();
}]);


/* var modalInstance = $modal.open({
            template: '<div class="modal-body"><p>Sind sie sicher?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-warning" ng-click="$close()">OK</button></div>',
            size: 'sm',
            scope: $scope
        });
        modalInstance.result.then(function () {
           $location.url('/home');
       }, function () {
           console.log('Modal dismissed at: ' + new Date());
       });
*/

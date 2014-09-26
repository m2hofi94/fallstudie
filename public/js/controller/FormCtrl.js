//********************************* Test Michael ************

/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Surveys', 'Authentication', '$modal', '$location', function ($scope, Surveys, Authentication, $modal, $location) {
    $scope.init = function() {
        $scope.authentication = Authentication;
        // for "Teilnehmer" Radio Button
        $scope.content = 'option1';

        // Standard Value for new survey
        $scope.standardQuestions = [
            {
                title: 'Wie fanden Sie die Veranstaltung?',
                type: 'Slider'
            },
            {
                title: 'Bitte begründen Sie Ihre Antwort',
                type: 'TextArea'
            }
        ];

        $scope.options = [
            {
                id: 0,
                type: 'Slider',
                value: 'Skala'
            },
            {
                id: 1,
                type: 'TextArea',
                value: 'Textfeld'
            }
        ];

        // Date Picker
        $scope.date = [
            {value: new Date()},
            {value: new Date()}
        ];

        $scope.fields = $scope.standardQuestions.slice();

        $scope.today();
        $scope.toggleMin();
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
            type: 'TextArea'
        });
    };

    $scope.removeQuestion = function (index) {
        $scope.fields.splice(index, 1);
    };

    $scope.submit = function() {
        Surveys.createSurvey($scope.fields)
        .success(function(data){
            console.log(data);
        }).error(function(err){
				console.log(err);
        });
    };

    $scope.cancel = function() {
        var modalInstance = $modal.open({
            template: '<div class="modal-body"><p>Sind sie sicher?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-warning" ng-click="$close()">OK</button></div>',
            size: 'sm',
            scope: $scope
        });

        modalInstance.result.then(function () {
           $location.url('/');
       }, function () {
           console.log('Modal dismissed at: ' + new Date());
       });
    };
    
    $scope.init();
}]);

//********************************* Test Michael ************

/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Questions', 'Authentication', '$modal', function ($scope, Questions, Authentication, $modal) {
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
        console.log($scope.fields[index]);
        $scope.fields.splice(index, 1);
    };

    $scope.open = function () {

       var modalInstance = $modal.open({
            template: '<div class="modal-body"><p>Sind sie sicher?</p></div><div class="modal-footer"><button class="btn btn-primary" ng-click="$modalInstance.close()">OK</button><button class="btn btn-warning" ng-click="$modalInstance.dimiss()">Cancel</button></div>',
            size: 'sm'
           }
       );

       modalInstance.result.then(function () {
           console.log('success');
       }, function () {
           console.log('Modal dismissed at: ' + new Date());
       });
    };

    $scope.submit = function() {

    };

    $scope.cancel = function() {
        $scope.open();
    };
    
    $scope.init();
}]);

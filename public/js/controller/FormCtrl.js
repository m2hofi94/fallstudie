//********************************* Test Michael ************

/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Questions', 'Authentication', function ($scope, Questions, Authentication) {
    $scope.init = function() {
        $scope.authentication = Authentication;
        // for "Teilnehmer" Radio Button
        $scope.content = "option1";
        $scope.title = 'Unbenannte Umfrage';

        $scope.fields = $scope.standardQuestions.slice();

        $scope.today();
        $scope.toggleMin();
        // $scope.getQuestions();
    };

    // Date Picker
    $scope.date = [
        {value: new Date()},
        {value: new Date()}
    ];

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

    // Options for survey
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

    // Standard Value for new question
    $scope.standardQuestions = [
        {
            title: "Wie fanden Sie die Veranstaltung?",
            type: "Slider"
        },
        {
            title: "Bitte begründen Sie Ihre Antwort",
            type: "TextArea"
        }
    ];

/*    $scope.getQuestions = function () {
        Questions.getQuestions().success(function (data) {
            $scope.fields = data;
        }).error(function (err) {
            console.log(err);
            $scope.result = err;
        });
    };
*/


    $scope.addQuestion = function () {

    };

    $scope.removeQuestion = function (field) {

    };

    
    $scope.init();
}]);

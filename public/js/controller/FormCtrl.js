/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Surveys', 'Authentication', '$modal', '$location', function ($scope, Surveys, Authentication, $modal, $location) {
    $scope.init = function() {
        $scope.inEditMode = false;
        $scope.authentication = Authentication;
        // for "Teilnehmer" Radio Button
        $scope.content = 'option1';
        $scope.title = '';
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
            {value: new Date()},
            {value: new Date()}
        ];

        if(Surveys.idToEdit != -1){
            $scope.inEditMode = true;
            $scope.title = Surveys.tempTitle;
            $scope.edit(Surveys.idToEdit); 
            
            // Surveys.tempTitle = '';
            // Surveys.idToEdit = -1;
            // $scope.inEditMode = false;
        
        }else {
            $scope.fields = $scope.standardQuestions.slice();
        }
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
            type: 'TextArea',
            rate: 6,
            input: ''
        });
    };

    $scope.removeQuestion = function (index) {
        $scope.fields.splice(index, 1);
    };

    $scope.edit = function(id){
        Surveys.getQuestions(id)
        .success(function(data){  
             console.log(data);
             $scope.fields = data;
        }).error(function(err){
             console.log(err);
        }); 
    };
    
    $scope.submit = function(status) {
        $scope.survey = [$scope.title, $scope.fields, status];
        
                                                           
        Surveys.createSurvey($scope.survey).success(function(data){
            // $scope.survey = [];

            if(status == 'draft'){
                $location.url('/home');
            } else {
                Surveys.publishSurvey(data.insertId).success(function(data){
                    $location.url('/publish/' + data.insertId);
                }).error(function(err){
                    console.log(err);
                });
            }
        }).error(function(err){

        });


        // console.log(status);

    };

    $scope.togglePreview = function() {
        $scope.preview = !$scope.preview;
    };

    $scope.cancel = function() {
        var modalInstance = $modal.open({
            template: '<div class="modal-body"><p>Sind sie sicher?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-warning" ng-click="$close()">OK</button></div>',
            size: 'sm',
            scope: $scope
        });

        modalInstance.result.then(function () {
           $location.url('/home');
       }, function () {
           console.log('Modal dismissed at: ' + new Date());
       });
    };

    $scope.init();
}]);



/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Surveys', 'Authentication', '$modal', '$location', function ($scope, Surveys, Authentication, $modal, $location) {
    $scope.init = function() {
        $scope.checkMessage = '';
        $scope.authentication = Authentication;
        // for "Teilnehmer" Radio Button
        $scope.content = 'option1';
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
            {value: new Date()},
            {value: new Date()}
        ];

        if(Surveys.idToEdit != -1){
            // $scope.inEditMode = true;
            $scope.title = Surveys.tempTitle;
            $scope.edit(Surveys.idToEdit); 
            console.log("edit " + Surveys.idToEdit);
            
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
             for(var i = 0; i < $scope.fields; i++){
                if($scope.fields[i].type === 'Slider'){
                    $scope.fields[i].rate = 6;
                }
             }
            Surveys.getRecipients(id)
            .success(function(data){
                 console.log(data);
                 var mail = data;
                 for(var i = 0; i < mail.length; i++){
                    $scope.emails +=  mail[i].email + ';';
                 }

            }).error(function(err){
                 console.log(err);
            });

        }).error(function(err){
             console.log(err);
        }); 
    };
    
    $scope.submit = function(status) {
        if($scope.checkFields()){
            if(Surveys.idToEdit != -1 && !Surveys.restart){
                Surveys.deleteSurvey(Surveys.idToEdit).success(function (data){
                }).error(function(data){

                });
                Surveys.idToEdit = -1;
            }
            Surveys.restart = false;

            if($scope.emails !== ''){
                $scope.recipient = $scope.emails.split(';');
                for(var i = 0; i < $scope.recipient.length; i++){
                    if(!$scope.recipient[i].match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
                        $scope.recipient.splice(i,1);
                        i--;
                    }
                }
            }

            $scope.survey = [$scope.title, $scope.fields, status, $scope.recipient];
            Surveys.createSurvey($scope.survey).success(function(data){
                if(status == 'draft'){
                    $location.url('/home');
                } else {
                    if($scope.emails !== ''){
                        Surveys.publishSurvey(data.insertId).success(function(data){
                            $location.url('/home');
                        }).error(function(err){
                            console.log(err);
                        });
                    } else {
                        Surveys.publishSurveyOpen(data.insertId).success(function(data){
                            console.log(data);
                            data = data.replace('"','');
                            data = data.replace('"','');
                            $location.url('/publish/' + data);
                        }).error(function(err){
                            console.log(err);
                        });
                    }

                }
            }).error(function(err){

            });
        }
    };

    $scope.togglePreview = function() {
        if($scope.checkFields())
        $scope.preview = !$scope.preview;

    };

    $scope.checkFields = function() {
      if($scope.title === ''){
          $scope.checkMessage = 'Titel der Umfrage darf nicht leer sein';
          return false;
      } else if ($scope.fields.length === 0){
          $scope.checkMessage = 'Die Umfrage muss mindestens eine Frage enthalten';
          return false;
      } else {
        return true;
      }
    };

    $scope.cancel = function() {
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

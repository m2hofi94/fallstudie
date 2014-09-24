//********************************* Test Michael ************

/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Questions', 'Authentication', function($scope, Questions,  Authentication) {
  $scope.authentication = Authentication;
  // for "Teilnehmer" Radio Button
  $scope.content = "option1"; 
    
  // Date Picker
  $scope.date = [{value: new Date()},{value : new Date()}];

  $scope.today = function(date) {
    date = new Date();
  };
  $scope.today();

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event, title) {
    $event.preventDefault();
    $event.stopPropagation();

    if(title == "buStart") {
        if($scope.openedStart !== true) {
        $scope.openedStart = true;
        } else {
            $scope.openedStart = false;
        }
    }
    if(title == "buEnd") {
        if($scope.openedEnd !== true) {
        $scope.openedEnd = true;
        } else {
            $scope.openedEnd = false;
        }
    }
  };
    
    
  // Options for survey
  $scope.options = [
    {
      id: 0, 
      name: 'Slider',
      value: 'Skala'
    },  
    {
      id: 1, 
      name: 'TextArea',
      value: 'Textfeld'
    }
  ];
    
  // Standard Value for new question
  $scope.standardQuestion = {
      surveyID: 1,
      title: "Geben Sie hier ihre Frage ein",
      type: "TextArea"
  };  
  
  $scope.getQuestions = function() {
        Questions.getQuestions().success(function(data) {
            $scope.fields = data;
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };
  $scope.getQuestions();
    
  $scope.addQuestion = function(){ 
    Questions.addQuestion($scope.standardQuestion).success(function(data) {
            $scope.getQuestions();
            console.log(data);
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
      // Reload questions for Window
      $scope.getQuestions();
  };
    
  $scope.removeQuestion = function(field) {
     Questions.removeQuestion(field.id).success(function(data) {
            field = null;
            // console.log(data);
            
        }).error(function(err) {
            // console.log(err);
            $scope.result = err;
        });
      // Reload questions for Window
      $scope.getQuestions();
   };

}]);  


    
	

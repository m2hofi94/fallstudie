//********************************* Test Michael ************

/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Questions', 'Authentication', function($scope, Questions,  Authentication) {
  $scope.authentication = Authentication;
  $scope.question = {title:"Wie fanden Sie die Veranstaltung?"};
  $scope.content = "option1";
  $scope.id = 0;


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


  $scope.getQuestions = function() {
        Questions.getQuestions().success(function(data) {
            $scope.fields = data;
            console.log($scope.fields);
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };
  $scope.getQuestions();

  // Options for survey
  $scope.options = [
    {
      id: 0, 
      name: 'Skala'
    },  
    {
      id: 1, 
      name: 'Textfeld'
    }
  ];
  $scope.textArea = $scope.options[1];
    
  // Standard Value for new question
  $scope.standardQuestion = {
      title: "Wie fanden Sie die Veranstaltung wirklich?",
      type: "Textarea"
  };  
  


    
  $scope.number = 1;
    
  $scope.addQuestion = function(){ 
    Questions.addQuestion($scope.standardQuestion).success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    $scope.number++;
  };
    
  $scope.removeQuestion = function() {
     console.log("remove");
     $scope.number--;   
        // var remove = document.getElementById(q);
        // document.all.questions.removeChild(remove);
   };
	
    $scope.getNumber = function(num) {
    return new Array(num);   
    };

    $scope.getID = function(){
        return $scope.id++;
    };
  
}]);  


    
	

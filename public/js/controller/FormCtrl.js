//********************************* Test Michael ************

/*globals angular */
'use strict';


angular.module('FormController', []).controller('FormCtrl', ['$scope', 'Authentication', function($scope,  Authentication) {  
  $scope.authentication = Authentication;
  $scope.question = {title:"Wie fanden Sie die Veranstaltung?"};
  $scope.content = "option1";
  $scope.id = 0;

  $scope.date = [{value: new Date()},{value : new Date()}];

  // Date Picker
  $scope.today = function(date) {
    date = new Date();
  };
  $scope.today();

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

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
    
  // entity to edit  
  $scope.entity = {  
      title: "This is my title",
      type: "Textarea"
  };  
  
  // fields description of entity  
  $scope.fields = [  
    {  
      name: 'title',  
      title: 'title',  
      required: true,  
      type: {  
        view: 'input'  
      }  
    },
    {  
      name: 'type',  
      title: 'type',  
      type: {  
        view: 'select',   
      }  
    } 
  ];  
    
  $scope.number = 1;
    
  $scope.addQuestion = function(){ 
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


    
	

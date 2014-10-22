/*globals angular */
'use strict';

angular.module('AnswerController', []).controller('AnswerCtrl', ['$scope', '$routeParams', 'Surveys', '$location', function ($scope, $routeParams, Surveys, $location) {
    $scope.token = $routeParams.token;
    $scope.tokenUrl = $location.$$absUrl.replace('publish', 'participate');
	$scope.loading = false;

    if(typeof $routeParams.title !== 'undefined')
        $scope.title = $routeParams.title;
    else
        $scope.title = Surveys.tempTitle;


    $scope.results = [];

    $scope.countOfAnswers = 0;
    // $scope.ratingResults = 0;
    // $scope.ratingValues = [];
    // $scope.countRatings = 0;
    // $scope.minimum = 0;
    // $scope.maximum = 0;

    $scope.go = function (path) {
            $location.url(path);
    };

    $scope.getQuestions = function (){
        $scope.loading = true;
		Surveys.getQuestionsWithToken($scope.token).success(function(data) {
            if(data.length === 0)
                $location.url('/noSurvey');

            $scope.fields = data[1];
            $scope.surveyID = data[2];
            for(var i = 0; i < $scope.fields.length; i++){
                if($scope.fields[i].type === 'TextArea'){
                    $scope.fields[i].input = '';
                } else {
                    $scope.fields[i].rate = 6;
                }
            }
            $scope.title = data[0];
            Surveys.tempTitle = data[0];
        }).error(function(err) {
            console.log(err);
            $location.url('/noSurvey');
        })
		.finally(function() {
			$scope.loading = false;
		});
    };

    $scope.send = function() {

        if($scope.fields.length !== 0){

            for(var i = 0; i < $scope.fields.length; i++){
                   if(typeof $scope.fields[i].input !== 'undefined'){
                        $scope.fields[i].input = $scope.fields[i].input.replace(/(?:\r\n|\r|\n)/g, '<br />');
                   }
            }

           var body = {token : $scope.token, answers : $scope.fields, surveyID : $scope.surveyID};
           Surveys.submitSurvey(body).success(function(data) {
               Surveys.tempTitle = $scope.title;
               $location.url('/thanks');
           }).error(function(err) {
               console.log(err);
           });
        }
    };

    $scope.evaluate = function(){

        for (var j = 0; j < $scope.results.length; j++){
            var sum = 0;
            $scope.results[j].ratingData.sort(function(a,b){return a -b;});
            for(var i = 0; i < $scope.results[j].ratingData.length; i++){
                $scope.results[j].graphData[0].values[$scope.results[j].ratingData[i]-1][1] +=1;
                sum +=  $scope.results[j].ratingData[i];
            }
            $scope.results[j].minimum = $scope.results[j].ratingData[0];
            $scope.results[j].average = Math.round(sum / $scope.results[j].ratingData.length * 100)/100;
            $scope.results[j].maximum = $scope.results[j].ratingData[$scope.results[j].ratingData.length -1];
        }
        /* $scope.ratingValues.sort(function(a,b){return a -b;});
         var sum = 0;
        for(var i = 0; i < $scope.ratingValues.length; i++){
            $scope.exampleData[0].values[$scope.ratingValues[i]-1][1] +=1;
           sum +=  $scope.ratingValues[i];
        }

        $scope.testData = $scope.exampleData.slice();

        $scope.minimum = $scope.ratingValues[0];
        $scope.average = Math.round(sum / $scope.ratingValues.length * 100)/100;
        $scope.maximum = $scope.ratingValues[$scope.ratingValues.length-1];

        [{
             "key": "Series 1",
             "values": [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0]]
        }]
        */
    };

    $scope.getResults = function() {
        // $scope.getQuestions();
        Surveys.getQuestions($scope.token).success(function(data) {
            // data = { created, id, surveyID, title, type }
            for(var i = 0; i < data.length; i++){
                $scope.results.push({id : data[i].id, title : data[i].title, type : data[i].type, answers : [], ratingData : [], graphData : [{
             "key": "Series 1",
             "values": [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0]]
        }], minimum : 0, maximum : 0, average : 0
                                    });
            }
            Surveys.getAnswers($scope.token).success(function(data) {
                // data = { id, questionID, surveyID, value }
                if(data.length === 0){
                    $scope.noAnswers = true;
                } else {
                    // Count of Answers is number of Answers divided by number of questions
                    $scope.countOfAnswers = data.length / $scope.results.length;
                    for (var j = 0; j < $scope.results.length; j++){
                        for(var i = 0; i < data.length; i++){
                            if(data[i].questionID == $scope.results[j].id){
                                if($scope.results[j].type == 'Slider'){
                                    // console.log(data[i].value + " .." );
                                    $scope.results[j].ratingData.push(parseInt(data[i].value));
                                    // console.log($scope.results[j].ratingData[0].values[parseInt(data[i].value)-1]);
                                    //$scope.ratingValues.push(parseInt(data[i].value));
                                } else {
                                    data[i].value = data[i].value.replace(/<br \/>/g, '\r\n');
                                   //  console.log(data[i].value);
                                    $scope.results[j].answers.push(data[i].value);
                                }
                            }
                        }
                    }
                    $scope.evaluate();
                    // console.log($scope.results);
                }
            }).error(function(err) {
                console.log(err);
            });
        }).error(function(err) {
            console.log(err);
        });
    };

    // init getQuestions if page is "Participate"
    if($location.$$path.indexOf('participate') != -1)
    $scope.getQuestions();
    if($location.$$path.indexOf('result') != -1)
    $scope.getResults();
}]);

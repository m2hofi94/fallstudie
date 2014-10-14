/*globals angular */
'use strict';

angular.module('AnswerController', []).controller('AnswerCtrl', ['$scope', '$routeParams', 'Surveys', '$location', function ($scope, $routeParams, Surveys, $location) {
    $scope.token = $routeParams.token;
    $scope.tokenUrl = $location.$$absUrl.replace('publish', 'participate');

    if(typeof $routeParams.title !== 'undefined')
        $scope.title = $routeParams.title;
    else
        $scope.title = Surveys.tempTitle;

    $scope.exampleData = [
                {
                    "key": "Series 1",
                    "values": [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0]]
                }];
    $scope.results = [];
    $scope.ratingResults = 0;
    $scope.ratingValues = [];
    $scope.countRatings = 0;
    $scope.minimum = 0;
    $scope.maximum = 0;

    $scope.go = function (path) {
            $location.url(path);
    };

    $scope.getQuestions = function (){
         Surveys.getQuestionsWithToken($scope.token).success(function(data) {
            console.log(data[1]);
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
        });
    };

    $scope.send = function() {
        if($scope.fields.length !== 0){
           var body = {token : $scope.token, answers : $scope.fields, surveyID : $scope.surveyID};
           Surveys.submitSurvey(body).success(function(data) {
               Surveys.tempTitle = $scope.title;
               $location.url('/thanks');
           }).error(function(err) {
               console.log(err);
           });
        }
    };

    $scope.getTextToCopy = function() {
        console.log('copy');
        return $scope.tokenUrl;
    };


    $scope.evaluate = function(){
        $scope.ratingValues.sort(function(a,b){return a -b;});
        var sum = 0;
        for(var i = 0; i < $scope.ratingValues.length; i++){
            $scope.exampleData[0].values[$scope.ratingValues[i]-1][1] +=1;
           sum +=  $scope.ratingValues[i];
        }

        $scope.testData = $scope.exampleData.slice();

        $scope.minimum = $scope.ratingValues[0];
        $scope.average = Math.round(sum / $scope.ratingValues.length * 100)/100;
        $scope.maximum = $scope.ratingValues[$scope.ratingValues.length-1];
    };

    $scope.getResults = function() {
        // $scope.getQuestions();
        Surveys.getQuestions($scope.token).success(function(data) {
            // data = { created, id, surveyID, title, type }
            for(var i = 0; i < data.length; i++){
                $scope.results.push({id : data[i].id, title : data[i].title, type : data[i].type, answers : []});
            }
            Surveys.getAnswers($scope.token).success(function(data) {
                // data = { id, questionID, surveyID, value }
                if(data.length === 0){
                    $scope.noAnswers = true;
                } else {
                    for (var j = 0; j < $scope.results.length; j++){
                        for(var i = 0; i < data.length; i++){
                            if(data[i].questionID == $scope.results[j].id){
                                if($scope.results[j].type == 'Slider'){
                                    $scope.ratingValues.push(parseInt(data[i].value));
                                } else {
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


angular.module('AnswerController').directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var focusedElement;
            element.on('click', function () {
                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    };
});

angular.module('AnswerController').config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("libs/zeroclipboard/dist/ZeroClipboard.swf");
}]);

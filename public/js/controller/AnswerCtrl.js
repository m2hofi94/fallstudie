/*globals angular */
'use strict';

angular.module('AnswerController', []).controller('AnswerCtrl', ['$scope', '$routeParams', 'Surveys', '$location', function ($scope, $routeParams, Surveys, $location) {
    $scope.token = $routeParams.token;
    $scope.tokenUrl = $location.$$absUrl.replace('publish', 'participate');
    $scope.title = Surveys.tempTitle;
    // $scope.results = [[],[]];


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
       var body = [$scope.token, $scope.fields, $scope.surveyID];
       Surveys.submitSurvey(body).success(function(data) {
           console.log("Erfolgreich");
           $location.url('/thanks');
       }).error(function(err) {
           console.log(err);
       });
    };

    $scope.getTextToCopy = function() {
        console.log('copy');
        return $scope.tokenUrl;
    };

    $scope.getResults = function() {
        // $scope.getQuestions();
        Surveys.getQuestions($scope.token).success(function(data) {
            // data = { created, id, surveyID, title, type }
            console.log(data.length);
            var titles = [];
            var ids = [];
            for(var i = 0; i < data.length; i++){
                titles.push(data[i].title);
                ids.push({id : data[i].id, value : ''});
            }
            $scope.results[1].push(ids);
            $scope.results[0].push(titles);
             console.log($scope.results);
        }).error(function(err) {
            console.log(err);
        });

        Surveys.getAnswers($scope.token).success(function(data) {
            // data = { id, questionID, surveyID, value }
            /*
            for (var j = 0; j < $scope.results[1].length; j++){
                for(var i = 0; i < data.length; i++){
                    console.log($scope.results[1][j]);
                    console.log(data[i].questionID);
                    if(data[i].questionID == $scope.results[1][j].id){
                        console.log("push");
                        $scope.results[1][1].push(data[i].value);
                    }
                }
            }
            */
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

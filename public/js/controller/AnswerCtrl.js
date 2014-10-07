/*globals angular */
'use strict';

angular.module('AnswerController', []).controller('AnswerCtrl', ['$scope', '$routeParams', 'Surveys', '$location', function ($scope, $routeParams, Surveys, $location) {
    $scope.token = $routeParams.token;
    $scope.tokenUrl = $location.$$absUrl.replace('publish', 'participate');

    $scope.getQuestions = function (){
         Surveys.getQuestionsWithToken($scope.token).success(function(data) {
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
        }).error(function(err) {
            console.log(err);
            $location.url('/noSurvey');
        });
    };
    $scope.getQuestions();

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

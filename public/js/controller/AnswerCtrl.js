/*globals angular */
'use strict';

angular.module('AnswerController', []).controller('AnswerCtrl', ['$scope', '$routeParams', 'Surveys', '$location', function ($scope, $routeParams, Surveys, $location) {
    $scope.token = $routeParams.token;
    $scope.tokenUrl = 'localhost:61701/#/participate/' + $scope.token;

    $scope.getQuestions = function (){
         Surveys.getQuestionsWithToken($scope.token).success(function(data) {
            console.log(data);
            $scope.fields = data[1];
            $scope.title = data[0];
        }).error(function(err) {
            console.log(err);
        });
    };
    $scope.getQuestions();

    $scope.send = function() {

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

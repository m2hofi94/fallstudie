/*globals angular */
'use strict';

angular.module('HomeController', []).controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.longUrl = '';
    $scope.shortUrl = 'http://bit.ly/1r31Vnc';

    $scope.shorten = function() {
        $http({
            method: 'GET',
            url: 'http://api.bitly.com/v3/shorten',
            params: {
                login: 'anfesys',
                apiKey: 'R_41a0e1d4d2fd4d479cae06f54bcc2735',
                longUrl: $scope.longUrl,
                domain: 'bit.ly'
            }
        }).success(function(data) {
            $scope.bitRes = data;
        }).error(function(data) {
            $scope.bitRes = data;
        });
    };

    $scope.getTextToCopy = function() {
        return $scope.shortUrl;
    };
}]);

angular.module('HomeController').directive('selectOnClick', function () {
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

angular.module('HomeController').config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("libs/zeroclipboard/dist/ZeroClipboard.swf");
}]);

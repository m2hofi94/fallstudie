/*globals angular */
'use strict';

angular.module('PublishController', []).controller('PublishCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
	 $scope.tokenUrl = $location.$$absUrl.replace('publish', 'participate');
	//required for local testing
	//$scope.tokenUrl = $location.$$absUrl.replace('localhost', 'afs.nunki.uberspace.de');

	$scope.shorten = function() {
        $http({
            method: 'GET',
            url: 'http://api.bitly.com/v3/shorten',
            params: {
                login: 'anfesys',
                apiKey: 'R_41a0e1d4d2fd4d479cae06f54bcc2735',
                longUrl: $scope.tokenUrl,
                domain: 'bit.ly'
            }
        }).success(function(data) {
            $scope.shortUrl = data.data.url;
			$scope.hash = data.data.hash;
        }).error(function(data) {
            $scope.bitRes = data;
        });
    };
	$scope.shorten();
}]);

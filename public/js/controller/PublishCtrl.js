/*globals angular */
'use strict';

angular.module('PublishController', []).controller('PublishCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
	 $scope.tokenUrl = $location.$$absUrl.replace('publish', 'participate');

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
			$scope.getQrCode();
        }).error(function(data) {
            $scope.bitRes = data;
        });
    };
	$scope.getQrCode = function() {
		$http({
			method: 'GET',
			url: 'http://api.qrserver.com/v1/create-qr-code/',
			params: {
				size: '200x200',
				data: $scope.shortUrl
			}
		}).success(function(data) {
			console.log(data);
		}).error(function(data) {

		});
	};

	$scope.shorten();
}]);

/*globals angular */
'use strict';

angular.module('Components', [])

.config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("libs/zeroclipboard/dist/ZeroClipboard.swf");
}])

.directive('selectOnClick', function () {
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
})

.directive('publicLink', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/components/publicLink.html',
		scope: {
			url: '=?'
		},
		controller: ['$scope', function($scope) {
			$scope.getTextToCopy = function() {
				console.log('hi');
				console.log($scope.url);
				return $scope.url;
			};
		}]
	};
});

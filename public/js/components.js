/*globals angular */
'use strict';

/**
 * Necessary for surveys that are published for everyone.
 * Generates Link and may copy it to clipboard
 */

angular.module('Components', [])

.config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("libs/zeroclipboard/dist/ZeroClipboard.swf");
}])

/**
 * selects the text on an input field
 * usage: <input select-on-click />
 */
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

/**
 * input element with copy-to-clipboard button
 * usage: <public-link url="http://google.de"></public-link>
 */
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
				return $scope.url;
			};
		}]
	};
});

/*globals angular */
'use strict';

angular.module('UserController', []).controller('UserCtrl', ['$scope', 'Users', '$location', function($scope, Users, $location) {
    $scope.result = {};

    //************************CRUD-Example********************

    $scope.list = function() {
        Users.list().success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };

    $scope.create = function() {
        Users.create($scope.createData).success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };

    $scope.read = function() {
        Users.read($scope.readData.id).success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };

    $scope.update = function() {
        Users.update($scope.updateData).success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };

    $scope.delete = function() {
        Users.delete($scope.deleteData.id).success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };
	
	
	//************************Signup**************************
    // redirects to users module on success
    // writes messages to $scope.result.message
    // server always returns 200, so data.success is required

	$scope.signUp = function(){
		if($scope.user.password == $scope.passwordCheck) {
			Users.signup($scope.user).success(function(data) {
				if (data.success) {
                    $location.url('/users');
                } else {
                    $scope.result = data;
                }
			}).error(function(err) {
				console.log(err);
				$scope.result = err;
			});
		} else {
			$scope.result.message = "Die Passwörter müssen übereinstimmen";
		}
	};
	
	//************************Login***************************
    //See above
	$scope.login = function(){
		Users.login($scope.loginData).success(function(data) {
            console.log(data);
            if (data.success) {
                $location.url('/users');
            } else {
                $scope.result = data;
            }
		}).error(function(err) {
			console.log(err);
            $scope.result = err;
		});
	};
	
	
	
}]);

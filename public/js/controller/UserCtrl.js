/*globals angular */
'use strict';

angular.module('UserController', []).controller('UserCtrl', ['$scope', 'Users', '$location', 'Authentication', function($scope, Users, $location, Authentication) {
    $scope.result = {};

    //************************Signup**************************
    // redirects to users module on success
    // writes messages to $scope.result.message
    // server always returns 200, so data.success is required

	$scope.signUp = function(){
		if($scope.user.password == $scope.passwordCheck) {
			Authentication.signup($scope.user).success(function(data) {
				if (data.success) {
					Authentication.user(data.user);
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
		Authentication.login($scope.loginData).success(function(data) {
            if (data.success) {
                //saving the user in the Authentication-Service
                Authentication.user(data.user);

                $location.url('/users');
            } else {
                $scope.result = data;
            }
		}).error(function(err) {
			console.log(err);
            $scope.result = err;
		});
	};
    
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
}]);



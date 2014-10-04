/*globals angular */
'use strict';

angular.module('UserController', []).controller('UserCtrl', ['$scope', 'Users', '$location', 'Authentication', function($scope, Users, $location, Authentication) {
    $scope.result = {};
    $scope.user = Authentication.user();


    // Use name / value pairs because "Kein Titel" needs empty String as value in Database
    $scope.titles = [
        {name : 'Kein Titel' , value : ''},
        {name : 'Prof.', value : 'Prof.'},
        {name: 'Dr.', value : 'Dr.'},
        {name : 'Prof. Dr.', value : 'Prof. Dr.'}];

    //************************Signup**************************
    // redirects to users module on success
    // writes messages to $scope.result.message
    // server always returns 200, so data.success is required
	$scope.signUp = function(){
		if($scope.user.password == $scope.passwordCheck) {
			Authentication.signup($scope.user).success(function(data) {
				if (data.success) {
					Authentication.user(data.user);
                   $location.url('/home');
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

                $location.url('/home');
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
        if($scope.user.passwordToChange == $scope.passwordCheck) {
            $scope.user.title = $scope.user.title == 'Kein Titel' ? '' : $scope.user.title;
            Users.update($scope.user).success(function(data) {
                $scope.result.message = "Änderung erfolgreich";
                // Changes cookie
                Authentication.user($scope.user);
            }).error(function(err) {
                console.log(err);
                $scope.result = err;
            });
         } else {
			$scope.result.message = "Die Passwörter müssen übereinstimmen";
		 }
    };

    $scope.deleteUser = function() {
        Authentication.logout();
        Users.delete($scope.user.id).success(function(data) {
            console.log(data);

        }).error(function(err) {
            console.log(err);
            $scope.result = err;
        });
    };
}]);




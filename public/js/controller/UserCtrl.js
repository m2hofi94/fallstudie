/*globals angular */
'use strict';

angular.module('UserController', []).controller('UserCtrl', ['$scope', 'Users', function($scope, Users) {
    $scope.result = {};

	
	
	
    //************************CRUD-Example********************

    $scope.list = function() {
        Users.list().success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
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
        });
    };

    $scope.update = function() {
        Users.update($scope.updateData).success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
        });
    };

    $scope.delete = function() {
        Users.delete($scope.deleteData.id).success(function(data) {
            console.log(data);
            $scope.result = data;
        }).error(function(err) {
            console.log(err);
        });
    };
	
	
	//************************Signup**************************
	$scope.registrateUser = function(){
		Users.registrateUser($scope.user).success(function(data) {
           console.log(data);
           $scope.result = data;
		   $scope.result.message = "Sie wurden erfolgreich registriert";
		   location.href='#/login';
		   
        }).error(function(err) {
          console.log(err);
		  $scope.result = err;
        });
	};
	
	
}]);

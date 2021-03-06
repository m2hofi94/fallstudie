/*globals angular */
'use strict';

/**
 * handles everything user-related
 */

angular.module('UserController', []).controller('UserCtrl', ['$scope', '$modal', 'Users', '$location', 'Authentication',
    function ($scope, $modal, Users, $location, Authentication) {
        $scope.result = {};
        /* Set boolean ChangedUserAlert -> after click on "submit new user Data" to show alert
         * the page reload because of updating the navbar deletes $scope.
         */
        if (Users.changedUserAlert) {
            $scope.result.message = 'Änderungen erfolgreich';
            Users.changedUserAlert = false;
        }
        $scope.user = Authentication.user();

        if (typeof $scope.user !== 'undefined' && $scope.user !== null)
            $scope.updatedUser = {
                id: $scope.user.id,
                title: $scope.user.title,
                email: $scope.user.email,
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                password: $scope.user.password
            };


        // Use name / value pairs because "Kein Titel" needs empty String as value in Database
        $scope.titles = [
            {
                name: 'Prof.',
                value: 'Prof.'
            },
            {
                name: 'Dr.',
                value: 'Dr.'
            },
            {
                name: 'Prof. Dr.',
                value: 'Prof. Dr.'
            }];

        /* Signup
         * redirects to users module on success
         * writes messages to $scope.result.message
         * server always returns 200, so data.success is required
         */
        $scope.signUp = function () {
            if (typeof $scope.user.title == 'undefined' || $scope.user.title === null)
                $scope.user.title = '';
            if ($scope.user.password == $scope.passwordCheck) {
                Authentication.signup($scope.user).success(function (data) {
                    if (data.success) {
                        Authentication.user(data.user);
                        $location.url('/home');
                    } else {
                        $scope.result = data;
                    }
                }).error(function (err) {
                    console.log(err);
                    $scope.result = err;
                });
            } else {
                $scope.result.message = "Die Passwörter müssen übereinstimmen";
            }

        };

        // Login, See above
        $scope.login = function () {
            Authentication.login($scope.loginData).success(function (data) {
                if (data.success) {
                    //saving the user in the Authentication-Service
                    Authentication.user(data.user);

                    $location.url('/home');
                } else {
                    $scope.result = data;
                }
            }).error(function (err) {
                console.log(err);
                $scope.result = err;
            });
        };

        $scope.update = function () {
            if (typeof $scope.updatedUser.title == 'undefined' || $scope.updatedUser.title === null) {
                $scope.updatedUser.title = '';
			}

            if ($scope.updatedUser.passwordToChange == $scope.passwordCheck) {
                Users.update($scope.updatedUser).success(function (data) {
                    Users.changedUserAlert = true;
                    // console.log
                    // Changes cookie // TODO
                    // $scope.user = $scope.updatedUser;
                    Authentication.user($scope.updatedUser);
                    $scope.user = Authentication.user();

                    // Update Navbar
                    $location.url('/profile/#');
                }).error(function (err) {
                    console.log(err);
                    $scope.result = err;
                });
            } else {
                $scope.result.message = "Die Passwörter müssen übereinstimmen";
            }
        };

        $scope.deleteUser = function () {
            var modalInstance = $modal.open({
                template: '<div class="modal-body"><p>M&ouml;chten Sie Ihren Account endg&uuml;ltig l&ouml;schen?</p></div><div class="modal-footer"><button class="btn btn-default" ng-click="$dismiss()">Cancel</button><button class="btn btn-danger" ng-click="$close()">OK</button></div>',
                size: 'sm',
                scope: $scope
            });

            modalInstance.result.then(function () {
                Authentication.deleteUser($scope.user.id);
                $location.url('/deleteUser');
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.emailPass = '';
        $scope.resetPassword = function () {
            Users.resetPassword({
                email: $scope.emailPass
            }).success(function (data) {
                console.log(data);
                if (data.affectedRows === 0) {
                    $scope.result.message = 'Diese E-Mail-Adresse ist uns nicht bekannt';
                } else {
                    $scope.result.message = 'Ihr Passwort wurde erfolgreich zurückgesetzt';
                    $scope.forgotPassword = false;
                }
            }).error(function (err) {
                $scope.result.message = 'Diese E-Mail-Adresse ist uns nicht bekannt';
            });
        };
    }]);

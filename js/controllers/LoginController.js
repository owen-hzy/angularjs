'use strict';

MetronicApp.controller('LoginController', function($rootScope, $scope, $state, $localStorage, Auth) {
    $scope.$on('$viewContentLoaded', function() {   
        Login.init(); // initialize core components 
    });

    function successAuth(response) {
    	if (response.accessToken) {
    		delete $scope.signinError;
       		$localStorage.token = response.accessToken;
        	$state.go('dashboard');
        } else if (response.errorMessage) {
        	$scope.signinError = response.errorMessage;
        }
    };

    $scope.signin = function() {
       	var formData = {
        	username: $scope.username,
        	password: $scope.password
        };

        Auth.signin(formData, successAuth, function() {
        	$scope.signinError = 'Server Error';
        });
    };
});
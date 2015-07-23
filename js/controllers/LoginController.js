'use strict';

MetronicApp.controller('LoginController', function($scope, $state, Auth) {
    $scope.$on('$viewContentLoaded', function() {   
        Login.init(); // initialize core components 
    });

    function successAuth(response) {
        if (response.errorMessage) {
            $scope.signinError = response.errorMessage;
        } else {
            delete $scope.signinError;
            $state.go('dashboard');
        }
    };

    $scope.signin = function() {
        delete $scope.signinError;
       	var formData = {
        	learnerId: $scope.learnerId,
        	password: $scope.password
        };

        Auth.signin(formData, successAuth, function(error) {
        	$scope.signinError = error.errorMessage;
        });
    };
});
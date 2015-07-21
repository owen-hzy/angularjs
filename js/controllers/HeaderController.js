"use strict";
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', function($scope, $state, Auth) {
    $scope.logout = function() {
        Auth.logout(function() {
            $state.go('login');
        });
    };
});
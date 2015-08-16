'use strict';

MetronicApp.controller('EditModuleController', function($scope, $stateParams, HttpService) {
    $scope.$on('$viewContentLoaded', function () {
        ComponentsDropdowns.init();
    });

    HttpService.sendRequest("/WebApi/api/protected/module/" + $stateParams.moduleId, "GET", 5000, true)
        .then(function(data) {
            console.log(data);
            $scope.module = data;
        }, function(error) {
            $scope.error = error.errorMessage || error.Message;
        })
});
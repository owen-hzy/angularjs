'use strict';

MetronicApp.controller('ModuleInfoController', function($scope, $modal, $stateParams, HttpService) {
    $scope.open = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/action-modal.html'
        });
    };

    HttpService.sendRequest("/WebApi/api/protected/module/" + $stateParams.moduleId, "GET", 5000, true)
        .then(function(data) {
            $scope.module = data;
        }, function(error) {
            $scope.error = error.errorMessage || error.Message;
        });

    HttpService.sendRequest("/WebApi/api/protected/module/" + $stateParams.moduleId + "/history3", "GET", 5000, true)
        .then(function(data) {
            $scope.moduleHistories = data;
        }, function(error) {
            $scope.error = error.errorMessage || error.Message;
        });
});
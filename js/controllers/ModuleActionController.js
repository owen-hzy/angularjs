'use strict';

MetronicApp.controller('ModuleActionController', function($scope, $modalInstance, action, HttpService) {
    $scope.action = {};
    $scope.action.action = action;

    $scope.confirm = function() {
        if ($scope.action.action == 'Delete') {
            console.log($scope.action.remarks);
            $modalInstance.close();
        } else {
            HttpService.sendRequest("/WebApi/api/protected/module/" + $scope.module.moduleId + "/action", "POST", 10000, true, $scope.action)
                .then(function (response) {
                    $scope.moduleHistories.unshift(response);
                    $scope.moduleHistories = $scope.moduleHistories.slice(0, 2);
                    $modalInstance.close();
                }, function (error) {
                    $scope.actionError = error.errorMessage || error.Message;
                });
        }
    }
});
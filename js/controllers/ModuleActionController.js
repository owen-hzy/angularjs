'use strict';

MetronicApp.controller('ModuleActionController', function($scope, $modalInstance, action, HttpService) {
    $scope.action = {};
    $scope.action.action = action;

    $scope.confirm = function() {
        delete $scope.actionError;
        if ($scope.action.action == 'Delete') {
            $modalInstance.close();
        } else {
            HttpService.sendRequest("/WebApi/api/protected/module/" + $scope.module.moduleId + "/action", "POST", 10000, true, $scope.action)
                .then(function (response) {
                    $scope.module.editStatus = response.editStatus;
                    $scope.moduleHistories.unshift(response.moduleHistoryDTO);
                    $scope.moduleHistories = $scope.moduleHistories.slice(0, 2);
                    $modalInstance.close();
                }, function (error) {
                    $scope.actionError = error.errorMessage || error.Message || error;
                });
        }
    }
});
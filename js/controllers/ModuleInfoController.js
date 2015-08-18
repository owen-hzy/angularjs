'use strict';

MetronicApp.controller('ModuleInfoController', function($scope, $modal, HttpService, module, history3, currentVersionExist) {
    $scope.module = module;
    $scope.moduleHistories = history3;
    $scope.currentVersionExist = currentVersionExist;

    $scope.open = function(action) {
        var modalInstance = $modal.open({
            templateUrl: 'views/action-modal.html',
            controller: 'ModuleActionController',
            resolve: {
                action: function() {
                    return action;
                }
            },
            scope: $scope
        });
    };
});
'use strict';

MetronicApp.controller('ModuleInfoController', function($scope, $modal, $stateParams) {
    $scope.open = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/action-modal.html'
        });
    }
});
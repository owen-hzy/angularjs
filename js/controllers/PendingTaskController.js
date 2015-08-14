'use strict';

MetronicApp.controller('PendingTaskController', function($scope) {
    $scope.$on('$viewContentLoaded', function () {
        dataTableInit.init();
        ComponentsDropdowns.init();
    });
});
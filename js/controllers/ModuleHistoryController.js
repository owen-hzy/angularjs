'use strict';

MetronicApp.controller('ModuleHistoryController', function($scope, $stateParams) {
    $scope.$on('$viewContentLoaded', function () {
        dataTableInit.initHistory($stateParams.moduleId);
    });
});
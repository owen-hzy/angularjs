'use strict';

MetronicApp.controller('ModuleController', function($scope) {
    $scope.$on('$viewContentLoaded', function () {
        dataTableInit.init();
    });
});
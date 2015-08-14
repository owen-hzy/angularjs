'use strict';

MetronicApp.controller('EditModuleController', function($scope, $stateParams) {
    $scope.$on('$viewContentLoaded', function () {
        ComponentsDropdowns.init();
    });

    console.log($stateParams);
});
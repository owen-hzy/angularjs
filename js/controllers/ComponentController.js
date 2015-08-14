'use strict';

MetronicApp.controller('ComponentController', function($scope) {
    $scope.$on('$viewContentLoaded', function () {
        ComponentsPickers.init();
        ComponentsDropdowns.init();
    });
});
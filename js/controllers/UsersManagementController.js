'use strict';

MetronicApp.controller('UsersManagementController', function($scope, $http) {
    $scope.$on('$viewContentLoaded', function() {   
         TableEditable.init();    
    });
});
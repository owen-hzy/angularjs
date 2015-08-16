'use strict';

MetronicApp.controller('ModuleAddController', function($scope, HttpService) {
    $scope.$on('$viewContentLoaded', function () {
        ComponentsDropdowns.init();
    });

    $scope.save = function() {
        delete $scope.success;
        delete $scope.error;
        var data = {
            "title": $scope.title,
            "divisionId": $scope.division
        };

        HttpService.sendRequest("/WebApi/api/protected/module", "POST", 10000, true, data).then(function() {
            $scope.success = "Saved";
        }, function(error) {
            $scope.error = error.errorMessage || error.Message;
        })
    }
});
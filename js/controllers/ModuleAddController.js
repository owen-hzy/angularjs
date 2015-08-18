'use strict';

MetronicApp.controller('ModuleAddController', function($scope, divisions, HttpService, $window) {


    $scope.module = {};
    $scope.divisions = divisions;

    $scope.save = function() {
        delete $scope.success;
        delete $scope.error;
        var data = {
            "moduleId": $scope.module.moduleId,
            "title": $scope.module.title,
            "divisionId": $scope.module.division.divisionId
        };

        HttpService.sendRequest("/WebApi/api/protected/module", "POST", 10000, true, data).then(function(data) {
            $window.location.href = "#/module-information/" + data;
        }, function(error) {
            $scope.error = error.errorMessage || error.Message;
        })
    }
});
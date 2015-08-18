'use strict';

MetronicApp.controller('ModuleEditController', function($scope, module, divisions, HttpService, $window) {

    $scope.module = module;

    $scope.module.selectedDivision = (function() {
        var divisionIds = $.map(divisions, function(value) {
            return value.divisionId;
        });
        var index = divisionIds.indexOf(module.divisionId);

        return divisions[index];
    })();

    $scope.divisions = divisions;

    $scope.save = function() {
        var data = {
            moduleId: $scope.module.moduleId,
            title: $scope.module.title,
            displayStatus: $scope.module.displayStatus,
            editStatus: $scope.module.editStatus,
            divisionId: $scope.module.selectedDivision.divisionId,
            owners: $scope.module.owners
        }

        HttpService.sendRequest("/WebApi/api/protected/module/" + module.moduleId, "PUT", 10000, true, data)
            .then(function(data) {
                $window.location.href = "#/module-information/" + data;
            }, function(error) {
                $scope.error = error.errorMessage || error.Message;
            });
    }


});
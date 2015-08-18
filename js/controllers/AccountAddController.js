'use strict';

MetronicApp.controller('AccountAddController', function($scope, modules, HttpService, $window) {
    $scope.$on('$viewContentLoaded', function () {
        ComponentsPickers.init();
    });

    $scope.account = {};
    $scope.modules = [];
    $scope.updateOnRemove = function($item) {
        if ($item == "ModuleOwner") {
            $scope.modules = [];
            $scope.account.modules = [];
        }
    }

    $scope.updateOnSelect = function($item) {
        if ($item == "ModuleOwner") {
            $scope.modules = modules;
        }
    }

    $scope.save = function() {
        delete $scope.error;
        HttpService.sendRequest("/WebApi/api/protected/users", "POST", 10000, true, $scope.account)
            .then(function(data) {
                $window.location.href = "#/account-information/" + data.learnerId;
            }, function(error) {
                $scope.error = error.errorMessage || error.Message;
            });
    }
});
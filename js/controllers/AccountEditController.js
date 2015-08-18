'use strict';

MetronicApp.controller('AccountEditController', function($scope, account, modules, HttpService) {
    $scope.$on('$viewContentLoaded', function () {
        ComponentsPickers.init();
    });

    $scope.account = account;
    $scope.modules = (function() {
       if (account.roles.indexOf("ModuleOwner") != -1) {
           return modules;
       } else {
           return [];
       }
    })();

    var initialSelection = (function(){
        var moduleId = [];
        var selectModules = [];
        modules.forEach(function(value) {
           moduleId.push(value.moduleId);
        });
        account.modules.forEach(function(module) {
            var index = moduleId.indexOf(module.moduleId);
            if (index != -1) {
                selectModules.push(modules[index]);
            }
        });
        return selectModules;
    })();

    $scope.account.selectedModules = initialSelection;

    $scope.updateOnRemove = function($item) {
        if ($item == "ModuleOwner") {
            $scope.modules = [];
            $scope.account.selectedModules = [];
        }
    }

    $scope.updateOnSelect = function($item) {
        if ($item == "ModuleOwner") {
            $scope.modules = modules;
            $scope.selectedModules = initialSelection;
        }
    }

    $scope.save = function() {
        delete $scope.success;
        delete $scope.error;
        var data = {
            learnerId: account.learnerId,
            username: $scope.account.username,
            postTitle: $scope.account.postTitle,
            contactPhone: $scope.account.contactPhone,
            contactEmail: $scope.account.contactEmail,
            requestDate: $scope.account.requestDate,
            roles: $scope.account.roles,
            modules: $scope.account.selectedModules
        };

        HttpService.sendRequest("/WebApi/api/protected/users/" + account.learnerId, "PUT", 10000, true, data)
            .then(function() {
                $scope.success = "Saved";
            }, function(error) {
                $scope.error = error.errorMessage || error.Message;
            });
    }
});
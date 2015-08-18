'use strict';

MetronicApp.controller('AccountInformationController', function($scope, account, HttpService, $state, $modal) {

    if (account.errorMessage || account.Message) {
        $scope.error = account.errorMessage || account.Message;
        return;
    }

    $scope.account = account;

    $scope.delete = function () {
        HttpService.sendRequest("/WebApi/api/protected/users/" + account.learnerId, "DELETE", 10000, true)
            .then(function() {
                $state.go("all-accounts");
            }, function(error) {
                $scope.error = error.errorMessage || error.Message;
            })
    }

    $scope.open = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/confirm-modal.html',
            scope: $scope
        });

        modalInstance.result.then(function(result) {
            if (result) {
                $scope.delete();
            }
        })
    };
});

'use strict';

MetronicApp.controller('DivisionController', function($scope, $http, $cookies, divisions, FileUploader){

    $scope.uploader = new FileUploader({
        url: '/WebApi/api/protected/division'
    });

    if (divisions.errorMessage) {
        $scope.errorMessage = 'Failed to load divisions, please refresh or contact administrator';
        return;
    } else {
        delete $scope.errorMessage;
    }

    // Variables Initialization
    $scope.divisions = [{},{},{},{},{},{},{},{}];

    divisions.forEach(function(value) {
        $scope.divisions[value.DivisionId - 1].name = value.DivisionName;
        $scope.divisions[value.DivisionId - 1].src = value.FileName;
    });

    $scope.uploader.onBeforeUploadItem = function(item) {
        var index = item.alias;
        var value = $scope.divisions[index - 1].name
        if (value) {
            var data = {};
            var name = "Division".concat(index);
            data[name] = value;
            item.formData.push(data);
        }
    };

    $scope.uploader.onSuccessItem = function(fileItem, response) {
        response.forEach(function(item, index) {
            $scope.divisions[item.DivisionId - 1].name = item.DivisionName;
            $scope.divisions[item.DivisionId - 1].src = item.FileName;
        });
    };

});
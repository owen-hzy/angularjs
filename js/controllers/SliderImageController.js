'use strict';

MetronicApp.controller('SliderImageController', function($scope, $http, $cookies, images, FileUploader) {

    $scope.uploader = new FileUploader({
       url: '/WebApi/api/protected/slider'
    });

    if (images.errorMessage) {
        $scope.errorMessage = 'Failed to load slider image, please refresh or contact administrator';
        return;
    } else {
        delete $scope.errorMessage;
    }

    $scope.images = [{},{},{}];

    images.forEach(function(value) {
       $scope.images[value.SliderId - 1].src = value.FilePath;
    });

    $scope.uploader.onSuccessItem = function(fileItem, response) {
        response.forEach(function(item) {
            $scope.images[item.SliderId - 1].src = item.FilePath;
        });
    };

});
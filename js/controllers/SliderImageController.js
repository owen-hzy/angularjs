'use strict';

MetronicApp.controller('SliderImageController', function($scope, $http, $localStorage, images) {

    if (images.errorMessage) {
        $scope.errorMessage = 'Failed to load slider image, please refresh or contact administrator';
        return;
    } else {
        delete $scope.errorMessage;
    }

    $scope.images = [{},{},{}];

    $scope.files = [];

    images.forEach(function(value) {
       $scope.images[value.SliderId - 1].src = value.FilePath;
    });

    $scope.$on('fileSelected', function(event, args) {
       $scope.$apply(function() {
          $scope.files[args.index] = args.file;
       });
    });



    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/WebApi/api/protected/slider',
            headers: {
                'Content-Type': undefined,
                Authorization: 'Bearer ' + $localStorage.token
            },
            transformRequest: function(data) {
                var formData = new FormData();
                data.files.forEach(function(value, index) {
                   formData.append("File" + index, value);
                });

                return formData;
            },
            data: {files: $scope.files}
        })
            .success(function(data) {
                data.forEach(function(item) {
                    $scope.images[item.SliderId - 1].src = item.FilePath;
                });
            });
    }
});
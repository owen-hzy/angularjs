'use strict';

MetronicApp.controller('SliderImageController', function($scope, $http, $cookies, images, Upload) {

    if (images.errorMessage) {
        $scope.errorMessage = 'Failed to load slider image, please refresh or contact administrator';
        return;
    } else {
        delete $scope.errorMessage;
    }

    $scope.images = [{},{},{}];

    $scope.files = [];
    $scope.fileNames = [];
    $scope.fileCount = 0;

    images.forEach(function(value) {
       $scope.images[value.SliderId - 1].src = value.FilePath;
    });

    $scope.$on('fileSelected', function(event, args) {
       $scope.$apply(function() {
           var index = $scope.fileNames.lastIndexOf("file" + args.index);
           if (index != -1)
           {
               if (typeof(args.file) === 'undefined')
               {
                   $scope.files.splice(index, 1);
                   $scope.fileNames.splice(index, 1);
                   --$scope.fileCount;
               }
               else
               {
                   $scope.files.splice(index, 1, args.file);
               }
           }
           else
           {
               $scope.files.push(args.file);
               $scope.fileNames.push("file" + args.index);
               ++$scope.fileCount;
           }
       });
    });
    $scope.submit = function() {
        $scope.progress = 0;
        //$http({
        //    method: 'POST',
        //    url: '/WebApi/api/protected/slider',
        //    headers: {
        //        'Content-Type': undefined,
        //        Authorization: 'Bearer ' + $localStorage.token
        //    },
        //    transformRequest: function(data) {
        //        var formData = new FormData();
        //        data.files.forEach(function(value, index) {
        //           formData.append("File" + index, value);
        //        });
        //
        //        return formData;
        //    },
        //    data: {files: $scope.files}
        //})
        //    .success(function(data) {
        //        data.forEach(function(item) {
        //            $scope.images[item.SliderId - 1].src = item.FilePath;
        //        });
        //    });
        Upload.upload({
            url: '/WebApi/api/protected/slider',
            file: $scope.files,
            headers: {
                Authorization: 'Bearer ' + $cookies.get('token')
            },
            fileFormDataName: $scope.fileNames
        }).progress(function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = progressPercentage;
        }).success(function(data)
        {
            $scope.fileNames = [];
            $scope.files = [];
            $scope.fileCount = 0;
            $scope.$broadcast('successUpload');
           data.forEach(function(item) {
              $scope.images[item.SliderId - 1].src = item.FilePath;
           });
        });
    }
});
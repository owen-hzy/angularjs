'use strict';

MetronicApp.controller('DivisionController', function($scope, $http, $cookies, divisions){

    if (divisions.errorMessage) {
        $scope.errorMessage = 'Failed to load divisions, please refresh or contact administrator';
        return;
    } else {
        delete $scope.errorMessage;
    }

    // Variables Initialization
    $scope.divisions = [{},{},{},{},{},{},{},{}];

    $scope.files = [];

    $scope.fileCount = 0;

    divisions.forEach(function(value) {
        $scope.divisions[value.DivisionId - 1].name = value.DivisionName;
        $scope.divisions[value.DivisionId - 1].src = value.FileName;
    });

    $scope.$on('fileSelected', function(event, args) {
        $scope.$apply(function(){
            if (typeof(args.file) === 'undefined') {
                $scope.files.splice(args.index, 1);
                $scope.fileCount--;
            }
            else
            {
                $scope.files[args.index] = args.file;
                $scope.fileCount++;
            }
        });
    });

    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/WebApi/api/protected/division',
            headers: {
                'Content-Type': undefined,
                Authorization: 'Bearer ' + $cookies.get('token')
            },
            transformRequest: function(data) {
                var formData = new FormData();
                for (var i = 0; i < data.divisions.length; i++) {
                    if (data.divisions[i].name != null) {
                        formData.append("Division" + (i + 1), data.divisions[i].name);
                    }
                }
                data.files.forEach(function(value, index) {
                    formData.append("File" + index, value);
                });

                return formData;
            },
            data: {divisions: $scope.divisions, files: $scope.files}
        })
            .success(function(data) {
                $scope.files = [];
                $scope.fileCount = 0;
                $scope.$broadcast('successUpload');
                data.forEach(function (item) {
                    $scope.divisions[item.DivisionId - 1].name = item.DivisionName;
                    $scope.divisions[item.DivisionId - 1].src = item.FileName;
                });
            });
        }
    });
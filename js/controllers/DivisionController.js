'use strict';

MetronicApp.controller('DivisionController', function($scope, $http, $localStorage){

    // Variables Initialization
    $scope.divisions = [{},{},{},{},{},{},{},{}];

    $scope.files = [];
    $scope.$on('fileSelected', function(event, args) {
        $scope.$apply(function(){
            $scope.files[args.index] = args.file;
        });
    });

    $scope.submit = function() {
        $http({
            method: 'POST',
            url: '/api/protected/division',
            headers: {
                'Content-Type': undefined,
                Authorization: 'Bearer ' + $localStorage.token
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
                data.forEach(function(item) {
                    $scope.divisions[item.DivisionId - 1].name = item.DivisionName;
                    $scope.divisions[item.DivisionId - 1].src = item.FileName;
                });
            });
    }
});
'use strict';

MetronicApp.controller('PreviewController', function($scope) {

    $scope.currentIndex = $scope.$parent.current.index;
    $scope.pageIndex = $scope.$parent.chapterList[$scope.currentIndex].pages.indexOf($scope.$parent.current) + 1;
    $scope.pageLength = $scope.$parent.chapterList[$scope.currentIndex].pages.length;

    $scope.next = function() {
        delete $scope.previousOver;
        if (($scope.pageIndex + 1) == $scope.pageLength) {
            $scope.nextOver = true;
        }

        $scope.pageIndex = $scope.pageIndex + 1;
        var content = $scope.$parent.chapterList[$scope.currentIndex].pages[$scope.pageIndex - 1].content || "";
        $("#previewBox").html(content);
    }

    $scope.previous = function() {
        delete $scope.nextOver;

        if (($scope.pageIndex - 1) == 1) {
            $scope.previousOver = true;
        }

        $scope.pageIndex = $scope.pageIndex - 1;
        var content = $scope.$parent.chapterList[$scope.currentIndex].pages[$scope.pageIndex - 1].content || "";
        $("#previewBox").html(content);
    }

});
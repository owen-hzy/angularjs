'use strict';

MetronicApp.controller('ModuleContentHomeController', function($scope) {

    $scope.current = {};

    $scope.chapterList = [
        {
            index: 0,
            chapter: 1,
            isChapter: true,
            pages: []
        },
        {
            index: 1,
            chapter: 2,
            subChapter: 1,
            isChapter: true,
            pages: []
        },
        {
            index: 2,
            chapter: 2,
            subChapter: 2,
            isChapter: true,
            pages: []
        },
        {
            index: 3,
            chapter: 2,
            subChapter: 3,
            isChapter: true,
            pages: []
        },
        {
            index: 4,
            chapter: 3,
            subChapter: 1,
            isChapter: true,
            pages: []
        },
        {
            index: 5,
            chapter: 3,
            subChapter: 2,
            isChapter: true,
            pages: []
        },
        {
            index: 6,
            chapter: 3,
            subChapter: 3,
            isChapter: true,
            pages: []
        },
        {
            index: 7,
            chapter: 4,
            subChapter: 1,
            isChapter: true,
            pages: []
        },
        {
            index: 8,
            chapter: 4,
            subChapter: 2,
            isChapter: true,
            pages: []
        },
        {
            index: 9,
            chapter: 4,
            subChapter: 3,
            isChapter: true,
            pages: []
        },
        {
            index: 10,
            chapter: 4,
            subChapter: 4,
            isChapter: true,
            pages: []
        },
        {
            index: 11,
            chapter: 5,
            subChapter: 1,
            isChapter: true,
            pages: []
        },
        {
            index: 12,
            chapter: 5,
            subChapter: 2,
            isChapter: true,
            pages: []
        },
        {
            index: 13,
            chapter: 5,
            subChapter: 3,
            isChapter: true,
            pages: []
        },
        {
            index: 14,
            chapter: 5,
            subChapter: 4,
            isChapter: true,
            pages: []
        },
        {
            index: 15,
            chapter: 6,
            subChapter: 1,
            isChapter: true,
            pages: []
        },
        {
            index: 16,
            chapter: 6,
            subChapter: 2,
            isChapter: true,
            pages: []
        },
        {
            index: 17,
            chapter: 6,
            subChapter: 3,
            isChapter: true,
            pages: []
        },
        {
            index: 18,
            chapter: 6,
            subChapter: 4,
            isChapter: true,
            pages: []
        }
    ];

    $scope.page = function(index1, index2) {
        if ($scope.current.isPage) {
            $scope.current.content = $("#moduleEditor").code();
        }

        if (index2 == null) {
            delete $scope.current.active;
            $scope.current = $scope.chapterList[index1];
            if ($scope.current.pages.length == 0) {
                $scope.current.active = true;
            }
        } else {
            delete $scope.current.active;
            $scope.current = $scope.chapterList[index1].pages[index2];
            $scope.current.active = true;
            $("#moduleEditor").code($scope.current.content);
        }
    }

    $scope.addPage = function() {
        var index = $scope.current.index;
        var newPage = {index: index, isPage: true, active: true};
        $scope.chapterList[index].pages.push(newPage);

        delete $scope.current.active;
        if ($scope.current.isPage) {
            $scope.current.content = $("#moduleEditor").code();
        }
        if ($scope.current.isChapter && $scope.current.pages.length > 1 ) {
            if (! $("#Ch" + $scope.current.index).next().is(":visible")) {
                $("#Ch" + $scope.current.index).trigger("click");
            }
        }
        $scope.current = $scope.chapterList[index].pages[$scope.chapterList[index].pages.indexOf(newPage)];
        $("#moduleEditor").code($scope.current.content || "");
    }
});
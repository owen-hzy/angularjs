'use strict';

MetronicApp.controller('ModuleContentController', function($scope, $modal, module, pages, chapters, $window, HttpService) {

    $scope.$parent.module = module;

    (function() {
        pages.forEach(function(page) {
            $scope.$parent.chapterList[page.index].pages[page.pageId - 1] = {index: page.index, isPage: true, content: page.content};
        });
        chapters.forEach(function(chapter) {
            $scope.$parent.chapterList[chapter.index].chapterTitle = chapter.chapterTitle;
            $scope.$parent.chapterList[chapter.index].subChapterTitle = chapter.subChapterTitle;
            $scope.$parent.chapterList[chapter.index].status = chapter.chapterStatus;
        })
    })();

    $scope.$on('$viewContentLoaded', function () {

        $("#moduleEditor").summernote({
            height: 560,
            width: 800,
            toolbar: [
                //['style', ['style']],
                ['font', ['bold', 'italic', 'strikethrough', 'superscript', 'subscript', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['misc', ['undo', 'redo']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['codeview']]
                //['help', ['help']]
            ],
        });

        $("input[type=radio][name=templateSelection]").change(function() {
            if (this.value=="0") {
                $("#moduleEditor").code($scope.$parent.current.content || "");
            }

            if (this.value=="1") {
                $.ajax("tpl/title.html")
                    .done(function(data) {
                       $("#moduleEditor").code(data);
                    });
            }

            if (this.value == "2") {
                $.ajax("tpl/static-block.html")
                    .done(function(data) {
                       $("#moduleEditor").code(data);
                    });
            }

            if (this.value == "3") {
                $.ajax("tpl/chapter-cover.html")
                    .done(function(data) {
                        $("#moduleEditor").code(data);
                    });
            }
        });
    });


    $scope.preview = function() {
        $scope.current.content = $("#moduleEditor").code();
        if ($scope.previewContent == null) {
            $.ajax({
                url: "views/preview.html",
                async: false
            }).done(function (data) {
                $scope.previewContent = data;
            });
        }

        var index = $scope.previewContent.indexOf("previewBox") + 12;
        var content = $("#moduleEditor").code();
        var previewContent = [ $scope.previewContent.slice(0, index), content, $scope.previewContent.slice(index)].join("");

        $modal.open({
            template: previewContent,
            controller: 'PreviewController',
            resolve: {
                content: function() {
                    var content = $("#moduleEditor").code();
                    return content;
                }
            },
            size: 'lg',
            scope: $scope
        });
    }


    $scope.cancel = function() {
        $window.location.href = "#/module-information/" + $scope.$parent.module.moduleId;
    }

    $scope.close = function() {
        delete $scope.success;
        delete $scope.error;
    }

    $scope.save = function() {
        delete $scope.success;
        delete $scope.error;
        var chapterId = $scope.$parent.chapterList[$scope.$parent.current.index].chapter;
        var subChapterId = $scope.$parent.chapterList[$scope.$parent.current.index].subChapter;
        var pageId = $scope.$parent.chapterList[$scope.$parent.current.index].pages.indexOf($scope.$parent.current) + 1;
        var pageContent = $("#moduleEditor").code();

        var data = {};
        if ($scope.$parent.current.isPage) {
            data.chapter = chapterId;
            data.subChapter = subChapterId;
            data.pageId = pageId;
            data.content = pageContent;
            data.moduleId = module.moduleId;
            data.index = $scope.$parent.current.index;

            HttpService.sendRequest("/WebApi/api/protected/page/save", "POST", 10000, true, data)
                .then(function() {
                    $scope.success = "Saved";
                    $scope.$parent.current.content = pageContent;
                }, function(error) {
                    $scope.error = error.errorMessage || error;
                });
        }
        if ($scope.$parent.current.isChapter) {
            data.moduleId = module.moduleId;
            data.chapterId = chapterId;
            data.subChapterId = subChapterId;
            data.chapterTitle = $scope.$parent.current.chapterTitle;
            data.subChapterTitle = $scope.$parent.current.subChapterTitle;
            data.chapterStatus = $scope.$parent.current.status;
            data.index = $scope.$parent.current.index;

            HttpService.sendRequest("/WebApi/api/protected/chapter/save", "POST", 10000, true, data)
                .then(function() {
                    $scope.success = "Saved";
                }, function(error) {
                    $scope.error = error.errorMessage || error;
                });
        }
    }

    $scope.delete = function() {
        var chapterInfo = $scope.$parent.chapterList[$scope.$parent.current.index];
        var index = chapterInfo.pages.indexOf($scope.$parent.current);

        var data = {
            moduleId: module.moduleId,
            chapter: chapterInfo.chapter,
            subChapter: chapterInfo.subChapter,
            pageId: index + 1,
            index: chapterInfo.index
        }

        HttpService.sendRequest("/WebApi/api/protected/page", "DELETE", 10000, true, data, 'application/json')
            .then(function() {
                $scope.$parent.chapterList[$scope.$parent.current.index].pages.splice(index, 1);
                $scope.$parent.current = {};
            }, function(error) {
                $scope.error = error.errorMessage || error;
            })
    }

});
'use strict';

MetronicApp.controller('ModuleContentController', function($scope, $modal) {
    $scope.$on('$viewContentLoaded', function () {
        $("#moduleEditor").summernote({
            height: 500,
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
        });
    });


    $scope.preview = function() {
        $.ajax("views/preview.html").done(function(data) {
            var index = data.indexOf("previewBox") + 12;
            var content = $("#moduleEditor").code();
            var previewContent = [ data.slice(0, index), content, data.slice(index)].join("");

            $modal.open({
                template: previewContent,
                controller: 'PreviewController',
                resolve: {
                    content: function() {
                        var content = $("#moduleEditor").code();
                        return content;
                    }
                }
            });
        });
    }

});
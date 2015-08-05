'use strict';

MetronicApp.directive('fileUpload', function(){
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
            element.bind('change', function(event) {
                var files = event.target.files;
                var index = event.target.dataset.name;
                scope.$emit('fileSelected', {file: files[0], index: index});
            });

            scope.$on('successUpload', function() {
                $(element).val("");
            });
        }
    }
});
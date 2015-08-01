'use strict';

MetronicApp.directive('fileUpload', function(){
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element) {
            element.bind('change', function(event) {
                var files = event.target.files;
                scope.$emit('fileSelected', {file: files[0], index: event.target.name});
            });
        }
    }
});
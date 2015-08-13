'use strict';

MetronicApp.directive('fileUpload', function(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.$on('successUpload', function() {
                $(element).val("");
            });
        }
    }
});
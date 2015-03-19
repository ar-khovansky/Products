'use strict';


angular


    .module('productsApp')


    .directive('ngPreview', ['$window', function($window) {
        var helper = {
            support: !!($window.URL && $window.URL.createObjectURL),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                scope.$watch(attributes.ngPreview, function(files){
                    if ( ! files || ! files.length )
                        return;

                    var file = files[0];

                    if (!helper.isFile(file)) return;
                    if (!helper.isImage(file)) return;

                    element.attr('src', $window.URL.createObjectURL(file));
                    element.on('load', function() {
                        $window.URL.revokeObjectURL(this.src);
                    });
                });
            }
        };
    }]);

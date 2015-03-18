angular.module('productsApp.services', [])
.factory('Product', function($resource) {
    return $resource('products/:id', { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})
.service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});
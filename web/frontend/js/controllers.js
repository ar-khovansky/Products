angular.module('productsApp.controllers', [])

.controller('ProductListController', function($scope, $state, popupService, $window, Product) {
    $scope.products = Product.query();

    $scope.deleteProduct = function(product) {
        if (popupService.showPopup('Do you want to delete the product?')) {
            product.$delete(function() {
                $state.reload();
            });
        }
    };

    $scope.$state = $state;
})

.controller('ProductCreateController', function($scope, $state, $stateParams, $upload, Product) {
    $scope.product = new Product();  //create new instance. Properties will be set via ng-model on UI

    $scope.inh = {};

    $scope.ok = function() {
        console.log($scope.inh.files);
        $scope.product.$save(function() {
            if ( $scope.inh.files && $scope.inh.files.length ) {
                var file = $scope.inh.files[0];

                $upload.upload({
                    url: '/products/'+$scope.product.id+'/photo',
                    method: 'POST',
                    file: file
                }).success(function(data, status, headers, config) {
                    //console.log('file ' + config.file.name + ' uploaded. Response: ' + data + " .Location: " + headers.location);
                    $state.go('^', null, {reload:true});
                }).error(function(data, status, headers, config) {
                    //console.log('file ' + config.file.name + ' upload error. Response: ' + data);
                    $state.go('^', null, {reload:true});
                });
            }
            else
                $state.go('^', null, {reload:true});
        });
    };

    $scope.cancel = function() {
        $state.go('^');
    };
})

.controller('ProductEditController', function($scope, $state, $stateParams, $upload, Product) {
    $scope.inh = {};

    $scope.ok = function() {
        $scope.product.$update(function() {
            if ( $scope.inh.files && $scope.inh.files.length ) {
                var file = $scope.inh.files[0];

                $upload.upload({
                    url: '/products/'+$scope.product.id+'/photo',
                    method: 'POST',
                    file: file
                }).success(function(data, status, headers, config) {
                    //console.log('file ' + config.file.name + ' uploaded. Response: ' + data + " .Location: " + headers.location);
                    $state.go('^', null, {reload:true});
                }).error(function(data, status, headers, config) {
                    //console.log('file ' + config.file.name + ' upload error. Response: ' + data);
                    $state.go('^', null, {reload:true});
                });
            }
            else
                $state.go('^', null, {reload:true});
        });
    };

    $scope.cancel = function() {
        $state.go('^');
    };

    $scope.loadProduct = function() { //Issues a GET request to /products/:id to get a product to update
        $scope.product = Product.get({ id: $stateParams.id });
    };

    $scope.loadProduct(); // Load product from server
})

;

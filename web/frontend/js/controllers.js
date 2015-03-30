angular.module('productsApp.controllers', [])

.controller('ProductListController', function($scope, $state, popupService, $window, productsModel) {
    $scope.products = productsModel.getProducts();

    $scope.deleteProduct = function(product) {
        if (popupService.showPopup('Do you want to delete the product?')) {
            productsModel.deleteProduct(product);
        }
    };

    $scope.$state = $state;
})

.controller('ProductCreateController', function($scope, $state, productsModel) {
    $scope.product = productsModel.newProduct();  //create new instance. Properties will be set via ng-model on UI

    $scope.inh = {};

    $scope.ok = function() {
        var file = $scope.inh.files && $scope.inh.files.length ? $scope.inh.files[0] : null;
        productsModel.addProduct($scope.product, file);

        $state.go('^');
    };

    $scope.cancel = function() {
        $state.go('^');
    };
})

.controller('ProductEditController', function($scope, $state, $stateParams, productsModel) {
    $scope.product = productsModel.getProductCopy($stateParams.id);

    $scope.inh = {};

    $scope.ok = function() {
        var file = $scope.inh.files && $scope.inh.files.length ? $scope.inh.files[0] : null;
        productsModel.updateProduct($scope.product, file);

        $state.go('^');
    };

    $scope.cancel = function() {
        $state.go('^');
    };
})

;

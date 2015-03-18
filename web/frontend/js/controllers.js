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

.controller('ProductCreateController', function($scope, $state, $stateParams, Product) {
    $scope.product = new Product();  //create new instance. Properties will be set via ng-model on UI

    $scope.ok = function() {
        $scope.product.$save(function() {
            $state.go('^', null, {reload:true}); // on success go back
        });
    };

    $scope.cancel = function() {
        $state.go('^');
    };
})

.controller('ProductEditController', function($scope, $state, $stateParams, Product) {
    $scope.ok = function() {
        $scope.product.$update(function() {
            $state.go('^', null, {reload:true}); // on success go back
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

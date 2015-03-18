angular.module('productsApp', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.modal',
                               'ngResource',
                               'productsApp.controllers', 'productsApp.services'])

// Using modal state provider technique from http://stackoverflow.com/a/24726331

.provider('modalState', function($stateProvider) {
    var provider = this;
    this.$get = function() {
        return provider;
    };
    this.state = function(stateName, options) {
        var modalInstance;
        $stateProvider.state(stateName, {
            url: options.url,
            onEnter: function($modal, $state) {
                modalInstance = $modal.open(options);
                modalInstance.result['finally'](function() {
                    modalInstance = null;
                    if ($state.$current.name === stateName) {
                        $state.go('^');
                    }
                });
            },
            onExit: function() {
                if (modalInstance) {
                    modalInstance.close();
                }
            }
        });
    };
})

.config(function($stateProvider, modalStateProvider, $urlRouterProvider /*, $locationProvider*/) {
    $stateProvider.state('products', {
        url: '/products',
        templateUrl: 'frontend/partials/products.html',
        controller: 'ProductListController'
    });
    $urlRouterProvider.otherwise('');

    modalStateProvider.state('products.new', {
        url: '/new',
        templateUrl: 'frontend/partials/product-new.html',
        controller: 'ProductCreateController'
    });
    modalStateProvider.state('products.edit', {
        url: '/:id/edit',
        templateUrl: 'frontend/partials/product-edit.html',
        controller: 'ProductEditController'
    });

    //$locationProvider.html5Mode(true);
})

.run(function($state) {
    $state.go('products');
})

;

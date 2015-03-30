angular.module('productsApp.services', [])

.factory('Product', function($resource) {
    return $resource('products/:id', { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
})



.factory('productsModel', ['Product', '$upload', function(Product, $upload){
    // Presentation model
    var products;

    var fields = ['id', 'title', 'description', 'photo_path'];
    var contentFields = fields.filter(function(e){ return e != 'id' });

    function getProduct(id) {
        for ( var i = 0; i < products.length; ++i ) {
            if ( products[i].id == id )
                return products[i];
        }

        throw new Error("Internal error");
    }

    function copyFields(to, from) {
        for ( var i = 0; i < fields.length; ++i ) {
            var field = fields[i];

            to[field] = from[field];
        }
    }

    function contentFieldsEqual(p1, p2) {
        for ( var i = 0; i < contentFields.length; ++i ) {
            var field = contentFields[i];

            if ( p1[field] != p2[field] )
                return false;
        }

        return true;
    }

    return {
        getProducts: function() {
            products = Product.query();
            return products;
        },

        newProduct: function() {
            return new Product();
        },

        getProductCopy: function(id) {
            var p = new Product;
            copyFields(p, getProduct(id));
            return p;
        },

        addProduct: function(product, imageFile) {
            product.$save(function() {
                products.push(product);

                if ( imageFile ) {
                    $upload.upload({
                        url: '/products/'+product.id+'/photo',
                        method: 'POST',
                        file: imageFile
                    }).success(function(data, status, headers, config) {
                        //console.log("file " + config.file.name + " uploaded. Location: " + headers('location'));
                        product.photo_path = headers('location');
                    }).error(function(data, status, headers, config) {
                        //console.log('file ' + config.file.name + ' upload error. Response: ' + data);
                    });
                }
            });
        },

        updateProduct: function(product, imageFile) {
            var existingProduct = getProduct(product.id);

            function afterUpdate() {
                if ( imageFile ) {
                    $upload.upload({
                        url: '/products/'+product.id+'/photo',
                        method: 'POST',
                        file: imageFile
                    }).success(function(data, status, headers, config) {
                        //console.log("file " + config.file.name + " uploaded. Location: " + headers('location'));
                        product.photo_path = headers('location');
                        copyFields(existingProduct, product);
                    }).error(function(data, status, headers, config) {
                        //console.log('file ' + config.file.name + ' upload error. Response: ' + data);
                        copyFields(existingProduct, product);
                    });
                }
                else
                    copyFields(existingProduct, product);
            }

            if ( ! contentFieldsEqual(product, existingProduct) )
                product.$update(afterUpdate);
            else
                afterUpdate();
        },

        deleteProduct: function(product) {
            product.$delete(function() {
                var i = products.indexOf(product);
                if ( i < 0 )
                    throw new Error("Internal error");
                products.splice(i, 1);
            });
        }
    }
}])



.service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
})

;
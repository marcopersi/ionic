'use strict';

// dependency injection of ngResource
angular.module('conFusion.services', ['ngResource'])
        // obviously the base URL would need to be changed if deployed to server & making it available to mobile devices
        .constant("baseURL","http://localhost:3000/")

        .factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {
            return $resource(baseURL+"dishes/:id",null,  {
                'update':{method:'PUT' }
            });
        }])

        .factory('promotionFactory', ['$resource', 'baseURL', function($resource,baseURL) {
            return $resource(baseURL+"promotions/:id");;
        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {
            return $resource(baseURL+"leadership/:id");
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
            return $resource(baseURL+"feedback/:id");
        }])

        .factory('favoriteFactory', ['$resource', 'baseURL', function($resource,baseURL) {
              var favFac = {};
              var favorites = [];

              favFac.addToFavorites = function(index) {
                  for (var i = 0; i<favorites.length; i++) {
                    if (favorites[i].id == index)
                      return;
                  }
                  favorites.push({id:index});
              }

              favFac.getFavorites = function() {
                  return favorites;
              }

              favFac.deleteFromFavorites = function(index) {
                  for (var i=0; i<favorites.length;i++)
                  {
                    if (favorites[i].id == index) {
                      // splice is javascript array method to remove an element from the array.
                      favorites.splice(i, 1);
                    }
                  }
              }

              return favFac;
        }])
;

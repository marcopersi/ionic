angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal - using the localStorage and the userinfo as key, the {} are the default value which is used if userinfo does not exist
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    // storing/saving the userdata into the local storage of the device.
    $localStorage.storeObject('userinfo',$scope.loginData);

    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
  }).then(function(modal) {
      $scope.reserveform = modal;
  });
  $scope.closeReserve = function() {
      $scope.reserveform.hide();
  };
  $scope.reserve = function() {
      $scope.reserveform.show();
  };
  $scope.doReserve = function() {
      console.log("doing reservation", $scope.reservation);
      $timeout(function() {
          $scope.closeReserve();
      }, 1000);
  };
})
.controller('MenuController', ['$scope', 'menuFactory','favoriteFactory', 'baseURL','$ionicListDelegate', function($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes = menuFactory.query(
      function(response) {
        $scope.dishes = response;
        $scope.showMenu = true;
      },
      function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
      });

      $scope.select = function(setTab) {
          $scope.tab = setTab;

          if (setTab === 2) {
            $scope.filtText = "appetizer";
          }
          else if (setTab === 3) {
            $scope.filtText = "mains";
          }
          else if (setTab === 4) {
            $scope.filtText = "dessert";
          }
          else {
            $scope.filtText = "";
          }
      };

      $scope.isSelected = function (checkTab) {
          return ($scope.tab === checkTab);
      };

      $scope.toggleDetails = function() {
          $scope.showDetails = !$scope.showDetails;
      };

      $scope.addFavorite = function(index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
      }
    }])

    .controller('ContactController', ['$scope', function($scope) {
        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
        $scope.channels = channels;
        $scope.invalidChannelSelection = false;
    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
        $scope.sendFeedback = function() {
        console.log($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        }
        else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            $scope.feedback.mychannel="";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
      };
  }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'dish','menuFactory','favoriteFactory', 'baseURL','$ionicPopover','$ionicModal','$timeout', function($scope, $stateParams, dish, menuFactory,favoriteFactory, baseURL, $ionicPopover,$ionicModal, $timeout) {
        $scope.baseURL = baseURL;
        $scope.dish = {};
        $scope.showDish = false;
        $scope.message="Loading ...";
        $scope.dish = dish;

        $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.popover = modal;
        });
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        $scope.addFavorite = function(index)
        {
          console.log("adding to favorites !")
          favoriteFactory.addToFavorites($scope.dish.id);
          $scope.closePopover();
        };

        $scope.comment = {rating:5, comment:"", author:"", date:""};
        $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.showComment = function() {
            $scope.modal.show();
        };

        $scope.closeComment = function() {
            $scope.modal.hide();
            $scope.closePopover();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.doComment = function() {
          $scope.comment.date = new Date().toISOString();
          console.log($scope.comment);
          $scope.dish.comments.push($scope.comment);
          menuFactory.update({id:$scope.dish.id}, $scope.dish);
          $scope.comment = {rating:5, comment:"", author:"", date:""};
          console.log("new comment was saved !");
          $timeout(function () {
            $scope.closeComment();
          }, 500);
        };
    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        $scope.submitComment = function () {
            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);
            $scope.dish.comments.push($scope.mycomment);
            menuFactory.update({id:$scope.dish.id},$scope.dish);
            $scope.commentForm.$setPristine();
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        };
    }])

    // implement the IndexController and About Controller here
    .controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory','corporateFactory','baseURL', function($scope, menuFactory, promotionFactory, corporateFactory, baseURL) {
        $scope.baseURL = baseURL;
        $scope.leader = corporateFactory.get({id:3});
        $scope.showDish = false;
        $scope.message="Loading ...";
        $scope.dish = menuFactory.get({id:0})
        .$promise.then(
            function(response){
                $scope.dish = response;
                $scope.showDish = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );
        $scope.promotion = promotionFactory.get({id:0});
    }])

    .controller('AboutController', ['$scope', 'corporateFactory','baseURL', function($scope, corporateFactory, baseURL) {
        $scope.baseURL = baseURL;
        $scope.leaders = corporateFactory.query();
        console.log($scope.leaders);
    }])
    .controller('FavoritesController', ['$scope','dishes','favorites','favoriteFactory', 'baseURL', '$ionicListDelegate','$ionicPopup', '$ionicLoading', '$timeout', function($scope, dishes, favorites,favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup,$ionicLoading, $timeout) {
        $scope.baseURL = baseURL;
        $scope.shouldShowDelete = false;

        $scope.favorites = favorites;
        $scope.dishes = dishes;
        console.log($scope.dishes, $scope.favorites);

        $scope.toggleDelete = function() {
          $scope.shouldShowDelete = !$scope.shouldShowDelete;
          console.log($scope.shouldShowDelete);
        }

        $scope.deleteFavorite = function(index) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete this item ?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                  console.log('Ok to delete');
                  favoriteFactory.deleteFromFavorites(index);
                } else {
                  console.log('Canceled delete ');
                }
            });
            $scope.shouldShowDelete=false;
        }
    }])

    // custom filter, 1st param is the filterName, the second paramter is the function which implements the filter.
    // actually the function has to return a function which implements the filter functionality
    .filter('favoriteFilter', function() {

        // for the parameter see the favorite.html page - it is iterating over the dishes and declares the favorites as paramter declared there.
        return function(dishes, favorites) {
            var out = [];
            for (var i = 0; i<favorites.length; i++)
            {
                for (var j = 0; j<dishes.length;j++) {
                    if (dishes[j].id === favorites[i].id) {
                      out.push(dishes[j]);
                    }
                }
            }
            return out;
        }

    })
;

define([
        'extendScope'
    ],
    function($extendScope) {
        return function($scope, $ionicModal, $timeout, $rootScope, $state, $viewer, $location) {
            $.extend($scope, $extendScope);

            $scope.menus = MyApp.menus;
            $scope.theme = MyApp.theme;
            $scope.controllers = MyApp.controllers;

            // Show or hide novigation bar
            $scope.showNavigationBar = false;

            console.log('Get viewer...');
            $scope.viewer = $viewer.get();

            $rootScope.$on('viewer:update', function(e, data) {
            	console.log('Update viewer info...');
                $scope.viewer = $viewer.get();
            });

            // Use broadcast to trigger a listen event
            // $rootScope.$broadcast('viewer:update', data);

            $scope.logout = function(){
            	$viewer.logout();
                $location.path('/app/' + MyApp.settings.homeUrl)
            }

            $scope.bLiveSite = MyApp.isLiveSite();

            $scope.switchLiveMode = function(){
                MyApp.switchLiveMode();
                $scope.bLiveSite = MyApp.isLiveSite();
            }
        }
    });

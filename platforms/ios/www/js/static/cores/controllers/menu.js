define([
        'extendScope'
    ],
    function($extendScope) {
        return function($scope, $ionicModal, $timeout, $rootScope, $state, $viewer, $location, $ionicSideMenuDelegate) {
            $.extend($scope, $extendScope);

            $scope.menus = MyApp.menus;
            $scope.theme = MyApp.theme;
            $scope.controllers = MyApp.controllers;
            $scope.$viewer = $viewer;

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

            $scope.logout = function() {
                $viewer.logout();
                $ionicSideMenuDelegate.toggleLeft();
                $location.path('/app/user/login');
            }

            $scope.bLiveSite = MyApp.isLiveSite();

            $scope.switchLiveMode = function() {
                MyApp.switchLiveMode();
                $scope.bLiveSite = MyApp.isLiveSite();
            }

            $scope.canShowMenu = function(menu) {
                if (!menu) {
                    return false;
                }
                if (!menu.params) {
                    return true;
                }
                if (menu.params.requireGuest) {
                    if ($viewer.isUser()) {
                        return false;
                    }
                }
                if (menu.params.requireUser) {
                    if (!$viewer.isUser()) {
                        return false;
                    }
                }
                return true;
            }
        }
    });

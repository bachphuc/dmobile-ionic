//jQuery, canvas and the app/sub module are all
//loaded and can be used here now.

define([],
    function() {
        return function($scope, $timeout, $userService) {
            alert('chan qua di');
            console.log('Core.index');
            $scope.items = [];

            $userService.GetFeed().then(function(items) {
                $scope.items = items;
            });

            $scope.doRefresh = function() {
                $userService.GetNewUser().then(function(items) {
                    $scope.items = items.concat($scope.items);
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            $scope.loadMore = function() {
                $userService.GetOldUsers().then(function(items) {
                    $scope.items = $scope.items.concat(items);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
        }
    });
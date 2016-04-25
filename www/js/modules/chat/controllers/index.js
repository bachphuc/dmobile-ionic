define([
    'js/modules/feed/models/feed',
], function($feedModel) {
    return function($scope, $dhttp, $rootScope, $ionicModal, $history, $viewer, $location, $chat, $timeout) {
        $history.push();
        console.log('chat');
        if (!$viewer.isUser()) {
            $location.path('/app/user/login');
        }

        $scope.users = {};
        $scope.totalUser = 0;
        $scope.isConnecting = true;

        $chat.addUserJoinCallbacks(function(data) {
            $scope.$$phrase || $scope.$apply();
        });

        $chat.addUserLeftCallback(function(data) {
            $scope.$$phrase || $scope.$apply();
        });

        $scope.getUsers = function() {
            $scope.users = $chat.getUsers();
        }

        $chat.addListenUserOnlineCallback(function(data) {
            $scope.getUsers();

            $scope.$$phrase || $scope.$apply();
        });

        $chat.onReady(function(data) {
            $scope.getUsers();
            console.log('socket connection ready...');

            $timeout(function() {
                $chat.getUserOnlineFromServer();
                $scope.isConnecting = false;
                $scope.$$phrase || $scope.$apply();
            }, 1000);
        });

        $chat.init();

        $$chatScope = $scope;
    }
});

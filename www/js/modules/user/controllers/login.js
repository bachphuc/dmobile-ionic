define([], function() {
    return function($scope, $http, $dhttp, $location, $timeout, $rootScope, $viewer, $cordovaToast) {
        console.log('user.login');
        $scope.loginData = {
            login: '',
            password: ''
        };

        $scope.loginSuccess = function($event, $args) {
            var data = $args.data;
            $viewer.setToken(data.data.token);
            $viewer.set(data.data.user);
            $timeout(function() {
                $location.path('/app/feed/index');
            }, 2000);
            $rootScope.$broadcast('viewer:update', {});
        }

        $scope.doLogin = function() {
            if ($scope.isLogin) {
                return;
            }
            $scope.isLogin = true;

            $dhttp.post('user.login', $scope.loginData).success(function(data) {
                $scope.isLogin = false;
                if (data.status) {
                    $scope.loginSuccess(data);

                    $cordovaToast.show('Login successfully.', 'short', 'bottom');
                } else {
                    alert(data.errors.join('.'));
                }
            }).error(function(data) {
                $scope.isLogin = false;
                $cordovaToast.show('Can not get data from server.', 'long', 'bottom');
            });
        }
    }
});

define([], function() {
    return function($scope, $http, $dhttp, $location, $timeout, $rootScope, $viewer, $cordovaToast, $state) {

        $scope.user_id = $state.params.user_id;

        $scope.feedConfig = {
            user_id: $scope.user_id
        };

        $scope.getUserDetail = function() {
            if ($scope.isProcessing) {
                return;
            }
            $scope.isProcessing = true;

            var sendData = {
                user_id: $scope.user_id
            }

            $dhttp.post('user.get', sendData).success(function(data) {
                $scope.isProcessing = false;
                if (data.status) {
                    if (data.data) {
                        $scope.user = data.data;
                    }

                } else {
                    alert(data.errors.join('.'));
                }
            }).error(function(data) {
                $scope.isProcessing = false;
                alert('Can not get data from server.');
            });
        };

        $scope.getUserDetail();
    }
});

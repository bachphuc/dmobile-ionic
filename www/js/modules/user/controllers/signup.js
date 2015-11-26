define([], function() {
    return function($scope, $http, $dhttp, $location, $timeout, $rootScope, $viewer, $cordovaToast, $history) {
        $history.push();

        $scope.formData = {};

        $scope.tempData = {};

        $scope.genders = [{
            value: 1,
            label: 'male'
        }, {
            value: 2,
            label: 'female'
        }];

        $scope.onProcessData = function(){
        	if($scope.tempData.birthday){
        		$scope.formData.day = $scope.tempData.birthday.getDay();
        		$scope.formData.month = $scope.tempData.birthday.getMonth();
        		$scope.formData.year = $scope.tempData.birthday.getYear();
        	}
        }

        $scope.doSignup = function() {
            if ($scope.isProcessing) {
                return;
            }

            $scope.isProcessing = true;

            $scope.onProcessData();
            console.log($scope.formData);
            $dhttp.post('user.signup', $scope.formData).success(function(data) {
                $scope.isProcessing = false;
                if (data.status) {
                    $cordovaToast.show('Signup account successfully.', 'short', 'bottom');
                    $viewer.loginSuccess(data);
                } else {
                    $cordovaToast.show(data.errors.join('.'), 'long', 'bottom');
                }
            }).error(function() {
                $scope.isProcessing = false;
                $cordovaToast.show('Can not get data from server.', 'long', 'bottom');
            });
        }

        $gSignupScope = $scope;
    }
});

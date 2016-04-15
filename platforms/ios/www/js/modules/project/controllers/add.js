define([], function() {
    return function($scope, $ionicHistory, $dhttp, $cordovaToast, $location, $history) {
        $history.push();
    	$scope.formData = {

    	};

        $scope.onCreateProject = function() {
            console.log('onCreateProject');
            if ($scope.isProcessing) {
                return;
            }
            $scope.isProcessing = true;

            $dhttp.post('project.add', $scope.formData).success(function(data) {
                $scope.isProcessing = false;
                if (data.status) {
                    $cordovaToast.show('Create project successfully.', 'short', 'bottom');
                    $location.path('/app/project/index');
                } else {
                    $cordovaToast.show(data.errors.join('.'), 'long', 'bottom');
                }
            }).error(function() {
                $scope.isProcessing = false;
                $cordovaToast.show('Can not get data from server.', 'long', 'bottom');
            });
        }
    }
});

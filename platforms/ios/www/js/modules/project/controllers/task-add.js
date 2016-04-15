define([
    'js/modules/project/models/project'
], function($model) {
    return function($scope, $ionicHistory, $dhttp, $cordovaToast, $location, $history, $state) {
        $history.push();
        $scope.formData = {

    	};
        $scope.formData.project_id = $scope.iProjectId = $state.params.project_id;

        $scope.onCreateTask = function() {
            console.log('onCreateTask');
            if ($scope.isProcessing) {
                return;
            }
            $scope.isProcessing = true;

            $dhttp.post('project.task.add', $scope.formData).success(function(data) {
                $scope.isProcessing = false;
                if (data.status) {
                    $cordovaToast.show('Create task successfully.', 'short', 'bottom');
                    $history.back();
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
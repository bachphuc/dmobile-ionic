define([
    'js/modules/project/models/project',
    'js/modules/project/models/task',
], function($model, $taskModel) {
    return function($scope, $ionicHistory, $dhttp, $cordovaToast, $location, $history, $state, $dListService) {
        $history.push();

        $scope.isDataReady = false;
        $scope.iProjectId = $state.params.project_id;

        $scope.getProjectDetail = function() {
            if ($scope.isProcessing) {
                return;
            }

            var sendData = {
                project_id: $scope.iProjectId
            }

            $dhttp.post('project.get', sendData).success(function(data) {
                $scope.isDataReady = true;
                if (data.status) {
                    if (data.data) {
                        $scope.project = $.extend(data.data, $model);
                    }

                } else {
                    alert(data.errors.join('.'));
                }
            }).error(function(data) {
                $scope.isDataReady = true;
                alert('Can not get data from server.');
            });
        };

        $scope.getProjectDetail();

        $scope.listConfig = {
            apiService: 'project.task.gets',
            listData : {
            	project_id : $scope.iProjectId
            }
        };
        $dListService.init($scope, $taskModel);
    }
});

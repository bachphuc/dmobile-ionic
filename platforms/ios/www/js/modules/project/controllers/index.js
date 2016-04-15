define([
    'js/modules/project/models/project'
], function($model) {
    return function($scope, $dListService, $history) {
    	$history.push();
    	
        $scope.listConfig = {
            apiService: 'project.gets'
        };
        $dListService.init($scope, $model);
    }
});

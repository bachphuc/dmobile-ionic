define([
    'js/modules/feed/models/feed'
], function($model) {
    return function($scope, $dhttp, $dListService) {
        $scope.listConfig = {
            apiService: 'user.gets'
        };
        $dListService.init($scope, $model);
    }
});

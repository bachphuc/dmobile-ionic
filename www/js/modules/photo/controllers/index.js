define([
    'js/modules/photo/models/photo'
], function($model) {
    return function($scope, $dhttp, $dListService) {
        $scope.listConfig = {
            apiService: 'photo.gets'
        };
        $dListService.init($scope, $model);
    }
});

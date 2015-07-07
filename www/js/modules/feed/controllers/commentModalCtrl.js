define([
    'js/modules/feed/models/feed',
], function($feedModel) {
    return function($scope, $dhttp, $rootScope, $ionicModal) {
        $scope.commentItems = [];
        $scope.commentItemPage = 1;

        $scope.canLoadMore = true;

        if($scope.parentObj){
            $scope.item = $scope.parentObj;
        }

        $scope.doRefresh = function() {
            
        };

        $scope.loadMore = function() {
            if ($scope.isProcessing) {
                return;
            }
            $scope.isProcessing = true;
            var sendData = {
                page: $scope.commentItemPage,
                limit : 20,
                item_type : $scope.obj.item_type,
                item_id : $scope.obj.item_id,
            }

            $dhttp.post('comment.gets', sendData).success(function(data) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.isProcessing = false;
                if (data.status) {
                    var items = $scope.setModel(data.data, $feedModel);
                    $scope.commentItems = $scope.commentItems.concat(items);
                    $scope.commentItemPage++;
                    if (data.data.length == 0) {
                        $scope.canLoadMore = false;
                    }
                } else {
                    alert(data.errors.join('.'));
                }
            }).error(function(data) {
                $scope.isProcessing = false;
                alert('Can not get data from server.');
            });
        };

        $$scope = $scope;
    }
});

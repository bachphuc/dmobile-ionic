define([
    'modulePath/feed/models/feed'
], function($feedModel) {
    return function($scope, $dhttp, $rootScope) {
        $scope.items = [];
        $scope.iPage = 0;
        $scope.iMaxFeedId = 0;

        $scope.canLoadMore = true;

        $scope.doRefresh = function() {
            if ($scope.isLoadNewProcessing) {
                return;
            }
            $scope.isLoadNewProcessing = true;

            var sendData = {
                max_feed_id: $scope.iMaxFeedId,
                action: 'loadnew'
            }

            $dhttp.post('feed.gets', sendData).success(function(data) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.isLoadNewProcessing = false;
                if (data.status) {
                    var items = $scope.setModel(data.data, $feedModel);

                    $scope.items = items.concat($scope.items);
                    $scope.iMaxFeedId = ($scope.items.length > 0 ? $scope.items[0].feed_id : 0);
                } else {
                    alert(data.errors.join('.'));
                }
            }).error(function(data) {
                $scope.isLoadNewProcessing = false;
                alert('Can not get data from server.');
            });
        };

        $rootScope.$on('feed.refresh', function() {
            console.log('Feed Refresh...');
            $scope.doRefresh();
        });

        $scope.loadMore = function() {

            if ($scope.isProcessing) {
                return;
            }
            $scope.isProcessing = true;
            var sendData = {
                page: $scope.iPage,
                limit : 200
            }

            $dhttp.post('feed.gets', sendData).success(function(data) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.isProcessing = false;
                if (data.status) {
                    var items = $scope.setModel(data.data, $feedModel);
                    $scope.items = $scope.items.concat(items);
                    $scope.iPage++;
                    $scope.iMaxFeedId = ($scope.items.length > 0 ? $scope.items[0].feed_id : 0);
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

        $scope.loadMore();
    }
});

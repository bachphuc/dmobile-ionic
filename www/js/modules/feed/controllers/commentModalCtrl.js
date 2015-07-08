define([
    'js/modules/feed/models/feed',
], function($feedModel) {
    return function($scope, $dhttp, $rootScope, $ionicModal, $cordovaToast) {
        $scope.commentItems = [];
        $scope.commentItemPage = 1;

        $scope.canLoadMore = true;

        if ($scope.parentObj) {
            $scope.item = $scope.parentObj;
        }

        $scope.commentData = {
            item_type: $scope.obj.item_type,
            item_id: $scope.obj.item_id,
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
                limit: 20,
                item_type: $scope.obj.item_type,
                item_id: $scope.obj.item_id,
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

        $scope.onAddComment = function() {
            if (!$scope.commentData.text || !$scope.commentData.text.trim().length) {
                return;
            }
            if ($scope.isAddCommentProcessing) {
                return;
            }
            $scope.isAddCommentProcessing = true;
            // increase total comment
            $scope.obj.total_comment++;
            $dhttp.post('comment.add', $scope.commentData).success(function(data) {
                $scope.isAddCommentProcessing = false;
                if (data.status) {
                    if ($scope.commentItems.length == 0) {
                        $scope.commentItems.push(data.data);
                    } else {
                        $scope.commentItems.splice(0, 0, data.data);
                    }
                    $scope.resetComment();
                    $cordovaToast.show('Comment successfully.', 'short', 'bottom');
                } else {
                    // restore total comment if comment fail
                    $scope.obj.total_comment--;
                    alert(data.errors.join('.'));
                }
            }).error(function(data) {
                // restore total comment if comment fail
                $scope.obj.total_comment--;
                $scope.isAddCommentProcessing = false;
                alert('Can not get data from server.');
            });
        }

        $scope.resetComment = function() {
            $scope.commentData.text = '';
        }

        $$scope = $scope;
    }
});
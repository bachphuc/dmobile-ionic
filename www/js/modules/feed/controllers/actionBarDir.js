define([
    'text!js/modules/feed/templates/comment-modal.html'
], function() {
    return function($scope, $dhttp, $ionicModal) {
        $scope.theme = MyApp.theme;
        $scope.likeToggle = function() {
            if ($scope.isLikeProcessing) {
                return;
            }
            $scope.isLikeProcessing = true;

            if ($scope.obj.like.is_like) {
                $scope.obj.like.total_like -= 1;
            } else {
                $scope.obj.like.total_like += 1;
            }
            $scope.obj.like.is_like = !$scope.obj.like.is_like;
            var postData = {
                type_id: $scope.obj.item_type,
                item_id: $scope.obj.item_id
            };

            var sApi = ($scope.obj.like.is_like ? 'like.like' : 'like.removeLike');
            $dhttp.post(sApi, postData).success($scope.likeSuccess).error($scope.likeFail);
        }

        $scope.likeSuccess = function(data) {
            $scope.isLikeProcessing = false;
            if (data.status) {
                $scope.obj.like = data.data;
            } else {
                alert(data.errors.join('.'));
            }
        }

        $scope.likeFail = function(error) {
            $scope.isLikeProcessing = false;
            alert('Can not get data from server.');
        }

        $scope.openCommentModal = function() {
            if($scope.parentObj.isFeedDetail){
                return;
            }
            if ($scope.commentModal) {
                $scope.commentModal.remove();
            }
            $scope.parentObj.isFeedDetail = true;
            $ionicModal.fromTemplateUrl('js/modules/feed/templates/comment-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.commentModal = modal;
                $scope.commentModal.show();
            });
        };

        $scope.closeCommentModal = function() {
            $scope.parentObj.isFeedDetail = false;
            $scope.commentModal.hide();
        };

        $$actionScope = $scope;
    }
});

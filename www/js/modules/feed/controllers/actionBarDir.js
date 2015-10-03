define([
    'text!js/modules/feed/templates/comment-modal.html'
], function() {
    return function($scope, $dhttp, $ionicModal, $timeout) {
        $scope.theme = MyApp.theme;
        $scope.likeToggle = function() {
            if ($scope.isLikeProcessing) {
                return;
            }
            $scope.isLikeProcessing = true;

            if ($scope.obj.is_like) {
                $scope.obj.total_like -= 1;
            } else {
                $scope.obj.total_like += 1;
            }
            $scope.obj.is_like = !$scope.obj.is_like;
            var postData = {
                type_id: $scope.obj.item_type,
                item_id: $scope.obj.item_id
            };

            var sApi = ($scope.obj.is_like ? 'like.like' : 'like.removeLike');
            $dhttp.post(sApi, postData).success($scope.likeSuccess).error($scope.likeFail);
        }

        $scope.likeSuccess = function(data) {
            $scope.isLikeProcessing = false;
            if (data.status) {
                $scope.obj.is_like = data.data.is_like;
                $scope.obj.total_like = data.data.total_like;
            } else {
                alert(data.errors.join('.'));
            }
        }

        $scope.likeFail = function(error) {
            $scope.isLikeProcessing = false;
            alert('Can not get data from server.');
        }

        $scope.openCommentModal = function() {
            if ($scope.parentObj.isFeedDetail) {
                $timeout(function() {
                    $('#comment-text').focus();
                    if (typeof cordova !== 'undefined') {
                        cordova.plugins.Keyboard.show();
                    }
                }, 100);
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

            $scope.$on('$destroy', function() {
                $scope.parentObj.isFeedDetail = false;
            });

            $scope.$on('modal.hidden', function() {
                $scope.parentObj.isFeedDetail = false;
            });

            $scope.$on('modal.removed', function() {
                $scope.parentObj.isFeedDetail = false;
            });
        };

        $scope.closeCommentModal = function() {
            $scope.parentObj.isFeedDetail = false;
            if (typeof cordova !== 'undefined') {
                if (cordova.plugins.Keyboard.isVisible) {
                    cordova.plugins.Keyboard.close();
                }
            }
            $scope.commentModal.hide();
        };

        $$actionScope = $scope;
    }
});

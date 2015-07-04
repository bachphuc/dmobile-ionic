define([], function() {
    return function($scope, $dhttp) {
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
                type_id: $scope.obj.type_item,
                item_id: $scope.obj.id_item
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
    }
});

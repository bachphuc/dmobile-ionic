define([
        'js/modules/feed/models/feed'
    ],

    function($feedModel) {
        return function($scope, $dhttp, $ionicModal, $timeout, $rootScope, $cordovaToast, $ionicActionSheet) {
            $scope.items = [];
            $scope.iMaxFeedId = 0;
            $scope.iMinFeedId = 0;

            $scope.canLoadMore = true;
            $scope.feedData = {};

            $scope.isCache = false;

            if ($scope.obj) {
                if ($scope.obj.user_id) {
                    $scope.feedData.user_id = $scope.obj.user_id;
                }
            }
            $scope.updateFeedInfo = function() {
                $scope.iMaxFeedId = ($scope.items.length > 0 ? $scope.items[0].feed_id : 0);
                $scope.iMinFeedId = ($scope.items.length > 0 ? $scope.items[$scope.items.length - 1].feed_id : 0);
            }

            $scope.doRefresh = function() {
                if ($scope.isLoadNewProcessing) {
                    return;
                }
                $scope.isLoadNewProcessing = true;

                var sendData = {
                    max_id: $scope.iMaxFeedId,
                    min_id: $scope.iMinFeedId,
                    action: 'loadnew'
                }
                sendData = $.extend({}, $scope.feedData, sendData);
                $dhttp.post('feed.gets', sendData).success(function(data) {
                    $timeout(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 300);
                    $scope.isLoadNewProcessing = false;
                    if (data.status) {
                        if (data.data) {
                            var items = $scope.setModel(data.data, $feedModel);
                            $scope.items = items.concat($scope.items);
                            $scope.updateFeedInfo();
                        }

                    } else {
                        alert(data.errors.join('.'));
                    }
                }).error(function(data) {
                    $scope.isLoadNewProcessing = false;
                    alert('Can not get data from server.');
                });
            };

            $rootScope.$on('feed.refresh', function() {
                if(!$scope.isCache){
                    return;
                }
                console.log('Feed Refresh...');
                $scope.doRefresh();
            });

            $scope.loadMore = function() {

                if ($scope.isProcessing) {
                    return;
                }
                $scope.isProcessing = true;
                var sendData = {
                    max_id: $scope.iMaxFeedId,
                    min_id: $scope.iMinFeedId,
                }
                sendData = $.extend({}, $scope.feedData, sendData);
                $dhttp.post('feed.gets', sendData).success(function(data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.isProcessing = false;
                    if (data.status) {
                        if (data.data) {
                            var items = $scope.setModel(data.data, $feedModel);
                            $scope.items = $scope.items.concat(items);
                            $scope.updateFeedInfo();
                        }

                        if (!data.data || data.data.length == 0) {
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

            $scope.onDelete = function(item){
                if($scope.isDeleteProcessing){
                    return;
                }
                $scope.isDeleteProcessing = true;

                var sendData = {
                    feed_id : item.feed_id
                }
                $dhttp.post('feed.delete', sendData).success(function(data) {
                    $scope.isDeleteProcessing = false;
                    if (data.status) {
                        if (data.data) {
                            var index = $scope.items.indexOf(item);
                            if(index != -1){
                                $scope.items.splice(index,1);
                                if(data.messages){
                                    Dmobi.showToast(data.messages.join('.'));
                                }
                            }
                        }
                    } else {
                        alert(data.errors.join('.'));
                    }
                }).error(function(data) {
                    $scope.isDeleteProcessing = false;
                    alert('Can not get data from server.');
                });
            }

            $scope.onItemSetting = function(item){
                $ionicActionSheet.show({
                buttons: [{
                    text: ' <i class="material-icons">&#xE2C3;</i> Delete Feed',
                    action: $scope.onDelete,
                    type: false
                }, {
                    text: ' <i class="material-icons">camera</i> Report Feed',
                    action: $scope.choosePhoto,
                    type: true
                }],
                cancelText: 'Cancel',
                cancel: function() {

                },
                buttonClicked: function(index) {
                    this.buttons[index].action(item);
                    return true;
                }
            });
            }
        }
    });

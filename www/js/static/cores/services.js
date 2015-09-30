define([
    'corePath/services/viewer'
], function() {
    console.log('Load services core...');

    angular.module(MyApp.appName)
        .factory('$dhttp', function($http, $ionicLoading) {
            return {
                post: function(api, data) {
                    var token = MyApp.token;
                    var url = MyApp.settings.serviceUrl + '?api=' + api;

                    if (token) {
                        data.token = token;
                    }
                    return $http.post(url, data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                },
                getFileName: function(path, type) {
                    var name = '';

                    if ('video' == type) {
                        if (ionic.Platform.isAndroid()) {
                            name = path.match(/\/([^\/]+)$/)[1] + '.mp4';
                        } else {
                            name = path.split('/').pop();
                        }
                    } else {
                        if (path.match(/[^\/]+.jpg$/g)) {
                            name = path.match(/[^\/]+.jpg$/ig)[0];
                        } else if (path.match(/id=(\w|\-)+/)) {
                            name = path.match(/id=(\w|\-)+/)[0].replace('id=', '') + '.jpg';
                        } else if (ionic.Platform.isAndroid()) {
                            name = path.match(/\/([^\/]+)$/)[1] + '.jpg';
                        }
                    }

                    return name;
                },
                getMimetype: function(type) {
                    if ('video' == type) {
                        return (ionic.Platform.isAndroid()) ? 'video/mp4' : 'video/quicktime';
                    } else {
                        return 'image/jpeg';
                    }
                },
                upload: function(api, fileUrl, type, data, successCallBack, errorCallBack) {
                    var ft = new FileTransfer();
                    var options = new FileUploadOptions();
                    var url = MyApp.settings.serviceUrl + '?api=' + api;

                    var token = MyApp.token;

                    if (token) {
                        data.token = token;
                    }

                    if (typeof type === 'undefined') {
                        type = 'photo';
                    }

                    $.extend(options, {
                        fileKey: 'image',
                        fileName: this.getFileName(fileUrl, type),
                        mimeType: this.getMimetype(type),
                        chunkedMode: false,
                        params: data
                    });

                    var percent = 0;

                    var success = function(result) {
                        console.log(result);
                        $ionicLoading.hide();
                        if (typeof successCallBack !== 'undefined' && successCallBack) {
                            if (typeof result.response !== 'undefined') {
                                result = JSON.parse(result.response);
                            }
                            successCallBack(result);
                        }
                    };

                    var error = function(error) {
                        console.log(error);
                        $ionicLoading.hide();
                        if (typeof errorCallBack !== 'undefined' && errorCallBack) {
                            errorCallBack(error);
                        }
                    };

                    ft.onprogress = function(progressEvent) {
                        if (progressEvent.lengthComputable) {
                            percent = (progressEvent.loaded * 100) / progressEvent.total;
                            $ionicLoading.show({
                                template: 'Uploading ' + parseInt(percent, 10) + '%, please wait ...'
                            });
                        }
                    };

                    $ionicLoading.show({
                        template: 'Uploading 0%, please wait ...'
                    });
                    ft.upload(fileUrl, url, success, error, options);
                }
            }
        })
        .factory('$dListService', function($dhttp) {
            return {
                init: function($scope, $model) {
                    $scope.items = [];
                    $scope.iMaxId = 0;
                    $scope.iMinId = 0;

                    $scope.canLoadMore = true;

                    $scope.updateListInfo = function() {
                        $scope.iMaxId = ($scope.items.length > 0 ? $scope.items[0].id : 0);
                        $scope.iMinId = ($scope.items.length > 0 ? $scope.items[$scope.items.length - 1].id : 0);
                    }

                    $scope.doRefresh = function() {
                        if ($scope.isLoadNewProcessing) {
                            return;
                        }
                        $scope.isLoadNewProcessing = true;

                        var sendData = {
                            max_id: $scope.iMaxId,
                            min_id: $scope.iMinId,
                            action: 'loadnew'
                        }
                        if ($scope.listConfig.listData) {
                            sendData = $.extend({}, $scope.listData, sendData);
                        }

                        $dhttp.post($scope.listConfig.apiService, sendData).success(function(data) {
                            $scope.$broadcast('scroll.refreshComplete');
                            $scope.isLoadNewProcessing = false;
                            if ($scope.refreshSuccess) {
                                $scope.refreshSuccess(data);
                            }
                            if (data.status) {
                                if (data.data) {
                                    if (typeof $model !== 'undefined') {
                                        var items = $scope.setModel(data.data, $model);
                                    } else {
                                        var items = data.data;
                                    }
                                    $scope.items = items.concat($scope.items);
                                    $scope.updateListInfo();
                                }

                            } else {
                                alert(data.errors.join('.'));
                            }
                        }).error(function(data) {
                            $scope.isLoadNewProcessing = false;
                            alert('Can not get data from server.');
                        });
                    };

                    $scope.doLoadMore = function() {

                        if ($scope.isProcessing) {
                            return;
                        }
                        $scope.isProcessing = true;
                        var sendData = {
                            max_id: $scope.iMaxId,
                            min_id: $scope.iMinId,
                        }
                        if ($scope.listConfig.listData) {
                            sendData = $.extend({}, $scope.listData, sendData);
                        }

                        $dhttp.post($scope.listConfig.apiService, sendData).success(function(data) {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.isProcessing = false;
                            if ($scope.loadMoreSuccess) {
                                $scope.loadMoreSuccess(data);
                            }
                            if (data.status) {
                                if (data.data) {
                                    if (typeof $model !== 'undefined') {
                                        var items = $scope.setModel(data.data, $model);
                                    } else {
                                        var items = data.data;
                                    }
                                    $scope.items = $scope.items.concat(items);
                                    $scope.updateListInfo();
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
                }
            }
        });
});

define([
    'corePath/services/viewer'
    ], function() {
    console.log('Load services core...');

    angular.module(MyApp.appName)
        .factory('$dhttp', function($http, $ionicLoading) {
            return {
                post: function(api, data) {
                    var token = MyApp.token;
                    $.extend(data, {
                        api: api,
                    });

                    if (token) {
                        data.token = token;
                    }
                    return $http.post(MyApp.settings.serviceUrl, data, {
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

                    var params = {
                        api: api,
                        args: data
                    };

                    var token = localStorage.getItem('token');

                    if (token) {
                        params.token = token;
                    }

                    if (typeof type === 'undefined') {
                        type = 'photo';
                    }

                    $.extend(options, {
                        fileKey: 'image',
                        fileName: this.getFileName(fileUrl, type),
                        mimeType: this.getMimetype(type),
                        chunkedMode: false,
                        params: params
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
                    ft.upload(fileUrl, MyApp.settings.serviceUrl, success, error, options);
                }
            }
        });
});

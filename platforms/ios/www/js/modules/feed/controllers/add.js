define([], function() {
    return function($scope, $dhttp, $location, $rootScope, $ionicActionSheet, $ionicPopup, $timeout, $cordovaToast, $stateParams) {
        $scope.data = {
            module: 'user'
        };

        $scope.doPost = function() {
            if ($scope.isProcessing) {
                return;
            }
            console.log($scope.data);
            if (!$scope.data.content || $scope.data.content.trim().length == 0) {
                return alert('Add some text to share.');
            }

            $scope.isProcessing = true;

            if ($scope.bUpload) {
                if (typeof cordova !== 'undefined') {
                    $dhttp.upload('feed.add', $scope.data.dataUrl, $scope.uploadType, $scope.data, $scope.postComplete, $scope.postFail);
                } else {
                    $dhttp.ajaxForm('feed.add', '#form_feed_add', $scope.postComplete, $scope.postFail);
                }

            } else {
                $dhttp.post('feed.add', $scope.data).success($scope.postComplete).error($scope.postFail);
            }
        };

        $scope.postComplete = function(data) {
            $scope.isProcessing = false;
            if (data.status) {
                $rootScope.$broadcast('feed.refresh');
                $timeout(function() {
                    $location.path('/app/feed/index');
                }, 2000);
                $cordovaToast.show('Successfully.', 'short', 'bottom');

            } else {
                $cordovaToast.show(data.errors.join('.'), 'long', 'bottom');
            }
        }

        $scope.postFail = function(data) {
            $scope.isProcessing = false;
            $cordovaToast.show('Can not get data from server.', 'long', 'bottom');
        }

        $scope.choosePhoto = function(bTakePhoto) {
            if (typeof bTakePhoto === 'undefined') {
                var bTakePhoto = false;
            }
            if (navigator && navigator.camera) {
                navigator.camera.getPicture(
                    function(fileURI) {
                        $scope.data.dataUrl = fileURI;
                        $scope.uploadType = 'photo';
                        $scope.bUpload = true;
                        $scope.bHasItem = true;
                        $scope.data.module = 'photo';
                        $scope.$$phase || $scope.$apply();
                    },
                    function() {

                    }, {
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: (bTakePhoto ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY),
                        encodingType: Camera.EncodingType.JPEG,
                        correctOrientation: true,
                    });
            } else {
                $('#image').click();
            }
        };

        $scope.shareStatus = function() {
            $scope.bUpload = false;
            $scope.bHasItem = false;
            $scope.data.module = 'user';
        }

        $scope.addPhoto = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: ' <i class="material-icons">&#xE2C3;</i> Choose from device',
                    action: $scope.choosePhoto,
                    type: false
                }, {
                    text: ' <i class="material-icons">camera</i> Take a photo',
                    action: $scope.choosePhoto,
                    type: true
                }],
                cancelText: 'Cancel',
                cancel: function() {

                },
                buttonClicked: function(index) {
                    this.buttons[index].action(this.buttons[index].type);
                    return true;
                }
            });
        };

        $scope.getPreviewLInk = function() {
            if ($scope.isProcessing) {
                return;
            }

            $scope.isProcessing = true;

            $dhttp.post('link.preview', $scope.data).success(function(data) {
                $scope.isProcessing = false;
                if (data.status) {
                    console.log(data);
                    $scope.data.linkdata = data.data;
                    $scope.data.linkdata.url = $scope.data.link_url;
                    $scope.data.linkdata.image = $scope.data.linkdata.default_image;
                    $scope.data.module = 'link';
                    $scope.bHasItem = true;
                } else {
                    alert(data.errors.join('.'));
                }
            }).error($scope.postFail);
        }

        $scope.showLinkPopup = function() {
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.link_url">',
                title: 'Share link',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.link_url) {
                            e.preventDefault();
                        } else {
                            $scope.getPreviewLInk();
                            return $scope.data.link_url;
                        }
                    }
                }]
            });
        }

        $scope.onSubmit = function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        $timeout(function() {
            $('#image').unbind('change').change(function(e) {
                console.log('image change');
                $scope.uploadType = 'photo';
                $scope.bUpload = true;
                $scope.bHasItem = true;
                $scope.data.module = 'photo';
                $scope.previewImage(this.files);
                $scope.$$phase || $scope.$apply();
            });
        }, 300);

        $scope.previewImage = function(files) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = /^image\//;

                if (!imageType.test(file.type)) {
                    continue;
                }
                $scope.data.dataUrl = window.URL.createObjectURL(file);
                $scope.$$phase || $scope.$apply();
            }

        }
    }
});
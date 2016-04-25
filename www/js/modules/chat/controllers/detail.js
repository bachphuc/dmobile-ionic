define([
    'js/modules/feed/models/feed',
], function($feedModel) {
    return function($scope, $state, $dhttp, $rootScope, $ionicModal, $history, $viewer, $location, $chat, $ionicScrollDelegate, $timeout, $dListService) {
        $history.push();
        var TAG = "Controller Detail";
        console.log('chat');
        if (!$viewer.isUser()) {
            $location.path('/app/user/login');
        }
        $scope.viewer = $viewer.get();
        $scope.username = $state.params.username;
        $scope.fullname = $state.params.fullname;
        $scope.items = [];
        $scope.config = {
            showTitle: false
        }

        // todo: declare room name
        $scope.roomName = $chat.generalRoomId($scope.username, "user" + $scope.viewer.id);
        DMobi.log(TAG, "chat in room " + $scope.roomName);
        $scope.chatUser;
        var chatUser;
        var chatService = $chat;

        $scope.form = {
            message: ''
        }

        $scope.isConnecting = true;
        $scope.isSendingMessage = false;

        $chat.onNewMessageListener(function(data) {
            console.log('chat detail : onNewMessageListener');
            if (!$scope.isSendingMessage) {
                $scope.$$phrase || $scope.$apply();
            }

            $scope.scrollToBottom();
        });

        $scope.onUpdateMessage = function(data) {
            $scope.$$phrase || $scope.$apply();
        }

        $scope.onSendChat = function() {
            if (!$scope.form.message) {
                return;
            }
            $scope.isSendingMessage = true;
            var chatMessage = new ChatMessage();
            chatMessage.message = $scope.form.message;
            chatMessage.receiveUsername = $scope.chatUser.getUsername();
            chatMessage.roomName = $scope.roomName;

            $chat.sendMessage(chatMessage);

            $scope.scrollToBottom();
            $scope.form.message = '';
            $scope.isSendingMessage = false;
        }

        $scope.scrollToBottom = function() {
            $timeout(function() {
                $ionicScrollDelegate.$getByHandle('chatDetailScroll').scrollBottom();
            }, 200);
        }

        $scope.choosePhoto = function(bTakePhoto) {
            if (typeof bTakePhoto === 'undefined') {
                var bTakePhoto = false;
            }
            if (navigator && navigator.camera) {
                navigator.camera.getPicture(
                    function(fileURI) {
                        $scope.choosePhotoSuccess(fileURI);
                    },
                    function() {
                        DMobi.log(TAG, "choosePhoto: fail");
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

        $scope.choosePhotoSuccess = function(filePath) {
            DMobi.log(TAG, "choosePhotoSuccess");
            // todo upload image and send message
            var chatMessage = new ChatMessage();
            chatMessage.photo = filePath;
            chatMessage.is_processing = true;
            chatMessage.receiveUsername = chatUser.getUsername();
            chatMessage.attachment_type = "photo";
            chatMessage.roomName = $scope.roomName;

            var params = new JSONObject();
            params.put("is_processing", true);
            params.put("attachment_type", "photo");
            var messageCreated = chatService.sendMessage(chatMessage, params);
            DMobi.log(TAG, "processing message key: " + chatMessage.getKey());
            uploadPhoto(filePath, messageCreated);
        }

        $timeout(function() {
            $('#image').unbind('change').change(function(e) {
                $scope.previewImage(this.files);
            });
        }, 300);

        $scope.previewImage = function(files) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = /^image\//;

                if (!imageType.test(file.type)) {
                    continue;
                }
                var dataUrl = window.URL.createObjectURL(file);
                $scope.choosePhotoSuccess(dataUrl);
            }

        }

        $scope.uploadPhoto = uploadPhoto = function(filePath, message) {
            if ($scope.isUploadProcessing) {
                return;
            }

            $scope.isUploadProcessing = true;
            if (typeof cordova !== 'undefined') {
                $dhttp.upload('dchat.upload', $scope.data.dataUrl, "photo", {}, function(data) {
                    $scope.uploadPhotoSuccess(data);
                    $scope.updateMessage(message.getKey(), data);
                }, $scope.uploadFail);
            } else {
                $dhttp.ajaxForm('dchat.upload', '#form-upload-chat-image', function(data) {
                    $scope.uploadPhotoSuccess(data);
                    $scope.updateMessage(message.getKey(), data);
                }, $scope.postFail);
            }
        };

        $scope.uploadPhotoSuccess = function(data) {
            DMobi.log(TAG, "uploadPhoto success");
            console.log(data);
            $scope.isUploadProcessing = false;
            $('#image').val('');
        }

        $scope.updateMessage = function(messageKey, data) {
            DMobi.log(TAG, "updateMessage key: " + messageKey);
            console.log(data);
            var message = chatUser.getProcessingMessage(messageKey);
            if (message) {
                message.is_complete = true;
                message.is_processing = false;
                message.photo_id = data.data.images[0].id;
                var jsonObject = new JSONObject();
                jsonObject.put("photo", data.data.images[0].url);
                jsonObject.put("photo_id", data.data.images[0].id);
                jsonObject.put("attachment_type", "photo");

                chatService.updateMessage(message, jsonObject);

                $scope.$$phrase || $scope.$apply();
            }
        }

        $scope.uploadFail = function(error) {
            $scope.isUploadProcessing = false;
        }

        $scope.doLoadOlderMessages = function() {
            DMobi.log(TAG, "doLoadOlderMessages");
        }

        $chat.onReady(function(data) {
            console.log('socket chat is ready');
            $scope.chatUser = chatUser = $chat.getUser($scope.username);

            if ($scope.chatUser) {
                $scope.items = $scope.chatUser.messages;
            }
            // try to connect to this user
            $timeout(function() {
                $chat.startChat($scope.username);
                $scope.isConnecting = false;
                $scope.$$phrase || $scope.$apply();
            }, 1000);
        });

        $chat.onSavedMessageSuccess(function(){
            $scope.updateListInfo();
        });
        
        // todo: scroll to bottom on first time load
        $scope.loadMoreSuccess = function(data){

        }

        $chat.init();

        // todo init list service
        $scope.listConfig = {
            apiService: 'dchat.message.gets',
            reverse : true,
            listData : {
                room_name : $scope.roomName
            }
        };
        var $model = new ChatMessage();
        $dListService.init($scope, $model);

        $$chatDetailScope = $scope;
    }
});

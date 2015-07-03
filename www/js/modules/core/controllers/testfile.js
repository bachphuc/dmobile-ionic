define([],
    function() {
        return function($scope) {
            $scope.takePhoto = function() {
                navigator.camera.getPicture(
                    function(fileURI) {
                        $scope.dataUrl = fileURI;
                        $scope.$$phase || $scope.$apply();
                    },
                    function() {
                        alert('Can not take a photo.');
                    }, {
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        encodingType: Camera.EncodingType.JPEG,
                        correctOrientation: true,
                    });
            };

            $scope.choosePhoto = function() {
                navigator.camera.getPicture(
                    function(fileURI) {
                        $scope.dataUrl = fileURI;
                        $scope.$$phase || $scope.$apply();
                    },
                    function() {
                        alert('Can not take a photo.');
                    }, {
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        encodingType: Camera.EncodingType.JPEG,
                        correctOrientation: true,
                    });
            };
        }
    });

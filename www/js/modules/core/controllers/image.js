//jQuery, canvas and the app/sub module are all
//loaded and can be used here now.

define([],
    function() {
        return function($scope, $timeout, $userService) {
            console.log('Core.image');

            var images = [];
            for(var i =0; i< 20 ; i++){
                var url = 'http://lorempixel.com/500/500/nature?' + ((new Date().getTime()) + i * 100);
                images.push(url);
            }

            $scope.images = images;
        }
    });
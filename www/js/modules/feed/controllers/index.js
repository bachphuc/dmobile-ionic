define([
    'js/modules/feed/models/feed',
], function($feedModel) {
    return function($scope, $dhttp, $rootScope, $ionicModal, $history) {
    	$history.push('Home', true);
    }
});

define([
    'js/modules/feed/models/feed',
], function($feedModel) {
    return function($scope, $dhttp, $rootScope, $ionicModal, $history, $viewer, $location ) {
    	$history.push('Home', true);

    	if(!$viewer.isUser()){
    		$location.path('/app/user/login');
    	}
    }
});

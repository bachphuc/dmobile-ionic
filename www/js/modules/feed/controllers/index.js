define([
    'js/modules/feed/models/feed',
], function($feedModel) {
    return function($scope, $dhttp, $rootScope, $ionicModal, $history, $viewer, $location ) {
    	$history.push('Home', true);
      $$location = $location;
    	if(!$viewer.isUser()){
    		return $location.path('/app/user/login');
    	}
    }
});

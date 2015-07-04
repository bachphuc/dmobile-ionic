define([], function() {
	return function($scope, $dhttp) {

		$scope.doLogout = function() {

			if ($scope.isProcessing) {
				return;
			}

			$scope.isProcessing = true;

			$dhttp.post('user.logout').success(function(data) {
				$scope.isProcessing = false;

				if (data.status) {
					localStorage.removeItem('token');
				} else {
					alert(data.errors.join('.'));
				}

			}).error(function(data) {

				$scope.isProcessing = false;
				alert('Can not connect to server.');

			}).finally(function() {

				$scope.isProcessing = false;

			});
		}
	}
});
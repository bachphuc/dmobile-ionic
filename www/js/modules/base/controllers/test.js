define([], function() {
    return function($scope) {
    	var data = [];
        for (var i = 0; i < 100; i++)
            data.push(i);
        $scope.data = data;
    }
});

define([
    'settings',
], function($setting) {
    console.log('init history service...');
    angular.module(MyApp.appName)
        .factory('$history', function($rootScope, $location) {

            var $history = {
                _data: [],
                _maxLength: 3,
                _root: {
                    path: '/' + $setting.homeUrl,
                    title: ''
                }
            };

            $history.clear = function() {

                $history = {
                    _data: [],
                    _root: {
                        path: '/' + $setting.homeUrl,
                        title: ''
                    }
                };

                return $history;
            };

            $history.back = function() {

                var last = $history._data.pop();

                if (last && last.path == $location.path()) {
                    last = $history._data.pop();
                };

                if (last) {
                    $location.path(last.path);
                    $rootScope.$$phase || $rootScope.$apply();
                } else if ($history._root.path != $location.path()) {
                    $location.path($history._root.path);
                    $rootScope.$$phase || $rootScope.$apply();
                } else {
                    ionic.Platform.exitApp();
                }
            };

            $history.go = function(seek) {

                var index = $history._data.length - 1 + seek;

                if (index < 0 || index >= len) {
                    return;
                }

                $location.path($history._data[index].path);
                $rootScope.$$phase || $rootScope.$apply();
            };

            $history.push = function(title, isRoot, replace) {

                var current = {
                    path: $location.path(),
                    title: title || ''
                };

                if (isRoot) {
                    $history._root = current;
                    $history._data = [];
                    $history._data.push(current);
                    return $history;
                }

                var len = $history._data.length;

                if (!len || $history._data[len - 1].path != current.path) { // add
                    if (len == $history._maxLength) {
                        $history._data.shift();
                    }
                } else { // update
                    $history._data.pop();
                }

                $history._data.push(current);

                return $history;
            };

            $history.getPrev = function() {

                var len = $history._data.length;
                var prev = $history._data[len - 1];

                if (prev && prev.path == $location.path()) {
                    prev = $history._data[len - 2];
                }

                if (prev) {
                    return prev;
                }

                return $history._root;
            };

            $history.getLevel = function() {
                return $history._data.length;
            };

            $history.canPrev = function() {
                var len = $history._data.length;
                if (!len) {
                    return false;
                }
                var prev = $history._data[len - 1];

                if (prev && prev.path == $location.path()) {
                    prev = $history._data[len - 2];
                }

                if (prev) {
                    return true;
                }

                return false;
            }

            return $history;

        });
});

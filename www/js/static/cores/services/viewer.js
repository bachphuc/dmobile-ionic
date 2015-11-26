define([], function() {
    angular.module(MyApp.appName)
        .factory('$viewer', function($rootScope, $timeout, $location) {
            return {
                get: function() {
                    if (MyApp.viewer) {
                        return MyApp.viewer;
                    }
                    var sViewerJson = localStorage.getItem(MyApp.settings.securityKey + '_viewer');
                    if (!sViewerJson || sViewerJson.trim().length == 0) {
                        MyApp.viewer = null;
                        return false;
                    }
                    var viewer = JSON.parse(sViewerJson);
                    MyApp.viewer = viewer;

                    this.getToken();
                    return viewer;
                },
                set: function(data) {
                    var sJsonViewer = JSON.stringify(data);
                    localStorage.setItem(MyApp.settings.securityKey + '_viewer', sJsonViewer);
                    MyApp.viewer = data;
                },
                update: function(data) {
                    if (MyApp.viewer) {
                        return this.set(data);
                    }
                    $.extend(MyApp.viewer, data);
                    return this.set(MyApp.viewer);
                },
                remove: function() {
                    localStorage.removeItem(MyApp.settings.securityKey + '_viewer');
                    MyApp.viewer = null;
                },
                getToken: function() {
                    if (MyApp.token) {
                        return MyApp.token;
                    }
                    var sToken = localStorage.getItem(MyApp.settings.securityKey + '_token');

                    if (!sToken || sToken.trim().length == 0) {
                        MyApp.token = null;
                        return false;
                    }
                    MyApp.token = sToken;
                    return sToken;
                },
                setToken: function(token) {
                    localStorage.setItem(MyApp.settings.securityKey + '_token', token);
                    MyApp.token = token;
                },
                removeToken: function() {
                    localStorage.removeItem(MyApp.settings.securityKey + '_token');
                    MyApp.token = null;
                },
                logout: function() {
                    this.removeToken();
                    this.remove();
                    $rootScope.$broadcast('viewer:update', {});
                },
                isUser: function() {
                    var token = this.getToken();
                    return token ? true : false;
                },
                loginSuccess: function(data) {
                    this.setToken(data.data.token);
                    this.set(data.data.user);
                    $rootScope.$broadcast('viewer:update', {});
                    $timeout(function() {
                        $location.path('/app/feed/index');
                    }, 2000);
                }
            }
        });
});

define([
    'settings',
], function($setting) {
    angular.module(MyApp.appName)
        .factory('$globalData', function($rootScope) {
            return {
                data: {},
                cacheTime: 15 * 60 * 1000,
                remove: function(key) {
                    if (typeof this.data[key] !== 'undefined') {
                        delete this.data[key];
                    }
                },
                put: function(key, value) {
                    this.data[key] = {
                        value: value,
                        time: new Date().getTime()
                    };
                },
                clear: function() {
                    this.data = {};
                },
                get: function(key) {
                    if (typeof this.data[key] !== 'undefined') {
                        var item = this.data[key];
                        if (new Date().getTime() - item.time < this.cacheTime) {
                            return item.value;
                        }
                        this.remove(key);
                    }
                    return null;
                }
            };
        });
});

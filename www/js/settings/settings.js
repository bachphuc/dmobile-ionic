define([], function() {
    return {
        appName: 'myapp',
        homeUrl: 'feed/index',
        securityKey: 'dmobile',
        // Company url API Service 1
        // serviceUrl : 'http://localhost/phpfox3.7.7/module/dmobile/api.php',
        // Company url API Service 2
        // serviceUrl : 'http://localhost/dmobile/module/dmobile/api.php'
        // Home url APi
        serviceUrl: 'http://192.168.1.5/dmobile/module/dmobile/api.php',
        // Live url API
        // serviceUrl : 'http://dmobi.pe.hu/module/dmobile/api.php',

        liveServiceUrl: 'http://192.168.1.5/dmobile/module/dmobile/api.php',
        // localServiceUrl : 'http://phpfox/phpfox.3.7.7/module/dmobile/api.php',
        localServiceUrl: 'http://192.168.1.5/dmobile/module/dmobile/api.php',
        getHomePage: function() {
            return '/app/' + this.homeUrl;
        }
    }
});

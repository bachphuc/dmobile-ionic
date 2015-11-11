//jQuery, canvas and the app/sub module are all
//loaded and can be used here now.
define([
        'application'
    ],
    function() {
        MyApp.registerModule('core')
            .addFactory('core.userService')
            .addController('core/welcome', 'core.welcome')
            .addMenu('Welcome', 'core/welcome');
    });

//jQuery, canvas and the app/sub module are all
//loaded and can be used here now.
define([
        'application'
    ],
    function() {
        MyApp.registerModule('core')
            .addFactory('core.userService')
            .addController('core', 'core.index')
            .addController('core/login', 'core.login')
            .addController('core/image', 'core.image')
            .addMenu('Core', 'core')
            .addMenu('Image', 'core/image')
            .addMenu('Login', 'core/login')
            .addController('core/testfile', 'core.testfile')
            .addMenu('Test file', 'core/testfile');
    });

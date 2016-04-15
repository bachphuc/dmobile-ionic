define([
    'application'
], function() {
    MyApp.registerModule('user')
        .addController('user/login', 'user.login')
        .addController('user/profile/:user_id', 'user.profile')
        .addController('user/members', 'user.members')
        .addController('user/signup', 'user.signup')
        .addMenu('Signup', 'user/signup', {
            requireGuest: true
        })
        .addMenu('Login', 'user/login', {
            requireGuest: true
        })
        .addMenu('Members', 'user/members');
});

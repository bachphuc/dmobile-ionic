define([
	'application'
], function() {
	MyApp.registerModule('user')
	.addController('user/login', 'user.login')
	.addController('profile', 'user.profile')
	.addMenu('LOGIN', 'user/login');
});
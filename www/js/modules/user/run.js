define([
	'application'
], function() {
	MyApp.registerModule('user')
	.addController('user/login', 'user.login')
	.addMenu('LOGIN', 'user/login');
});
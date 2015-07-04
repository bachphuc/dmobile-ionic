define([
	'application'
], function() {
	MyApp.registerModule('user')
	.addController('user/login', 'user.login')
	.addMenu('LOGIN', 'user/login')
	// .addController('user/logout', 'user.logout')
	// .addMenu('LOGOUT', 'user/logout')
	// .addController('user/test', 'user.test')
	// .addMenu('Test', 'user/test')
	;
});
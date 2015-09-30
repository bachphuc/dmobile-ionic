define([
	'application'
], function() {
	MyApp.registerModule('user')
	.addController('user/login', 'user.login')
	.addController('user/profile/:user_id', 'user.profile')
	.addController('user/members', 'user.members')
	.addMenu('Login', 'user/login')
	.addMenu('Members', 'user/members');
});
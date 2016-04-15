define([
	'application'
], function() {
	MyApp.registerModule('photo')
	.addDirective('photo.feedItem')
	.addController('photo/index', 'photo.index')
	.addMenu('Photo', 'photo/index');
});
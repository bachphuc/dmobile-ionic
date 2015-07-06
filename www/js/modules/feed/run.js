define([
	'application'
], function() {
	MyApp.registerModule('feed')
	.addController('feed/index', 'feed.index')
	.addMenu('Home', 'feed/index')
	.addController('feed/add', 'feed.add')
	.addMenu('POST', 'feed/add')
	.addDirective('feed.actionBar', {controller : true})
	.addController('feed/nojs', 'feed.nojs')
	;
});
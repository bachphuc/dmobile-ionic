define([
	'application'
], function() {
	MyApp.registerModule('project')
	.addController('project/index', 'project.index')
	.addMenu('Project', 'project/index')
	.addController('project/add', 'project.add')
	.addMenu('Create a Project', 'project/add')
	;
});
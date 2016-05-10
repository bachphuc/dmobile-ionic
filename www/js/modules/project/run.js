define([
	'application'
], function() {
	MyApp.registerModule('project')
	.addController('project/index', 'project.index')
	.addMenu('Project', 'project/index')
	.addController('project/add', 'project.add')
	// .addMenu('Create a Project', 'project/add')
	.addController('project/view/:project_id', 'project.view')
	.addController('project/task/add/:project_id', 'project.task-add')
	;
});

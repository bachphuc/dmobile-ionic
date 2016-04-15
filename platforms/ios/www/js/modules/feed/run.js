define([
    'application'
], function() {
    MyApp.registerModule('feed')
        .addController('feed/index', 'feed.index')
        .addMenu('Home', 'feed/index')
        .addController('feed/add', 'feed.add')
        .addDirective('feed.actionBar', { controller: true })
        .addController('feed/nojs', 'feed.nojs')
        .addController('', 'feed.commentModalCtrl', true)
        .addDirective('feed.display', { controller: true });
});

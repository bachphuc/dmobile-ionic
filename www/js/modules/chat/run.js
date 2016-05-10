define([
    'application'
], function() {
    MyApp.registerModule('chat')
        .addFactory('chat.chat')
        .addController('chat/index', 'chat.index')
        .addController('chat/detail/:username/:fullname', 'chat.detail')
        // .addMenu('Chat', 'chat/index')
    ;
});

define([
    'io',
    'chatservice',
], function(io) {
    return function($dhttp, $viewer, $timeout, $state) {
        sChat = new SChat();
        sChat.setUserService($viewer);
        sChat.setHttpService($dhttp)
        sChat.setIO(io);
        sChat.init();
        return sChat;
    }
});

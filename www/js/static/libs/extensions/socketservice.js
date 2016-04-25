function generalRoomId(from, to) {
    if (from > to) {
        return (to + "_" + from);
    }
    return (from + "_" + to);
}

var SocketChat = function() {
    var socket = null;
    var viewer = $viewer.get();
    var users = {};
    var totalUser = 0;
    var bSocketReady = false;
    var isLoginProcessing = false;

    this.getCurrentViewer = function() {
        viewer = $viewer.get();
        return viewer;
    }
    this.getSocket = function() {
        return socket;
    }
    this.processAddCallback = function(callbacks, callback) {
        if (!callback) {
            return;
        }
        if (typeof callback !== 'function') {
            return;
        }

        callbacks.push(callback);
    }

    this.getUsers = function() {
        return users;
    }

    var newMessageCallBacks = [];
    this.addNewMessageCallBack = function(callback) {
        this.processAddCallback(newMessageCallBacks, callback);
    }

    var userJoinCallbacks = [];
    this.addUserJoinCallbacks = function(callback) {
        this.processAddCallback(userJoinCallbacks, callback);
    }

    var talkCallbacks = [];
    this.onNewMessageListener = function(callback) {
        this.processAddCallback(talkCallbacks, callback);
    }
    this.addTalkCallback = function(callback) {
        this.processAddCallback(talkCallbacks, callback);
    }

    var userleftCallbacks = [];
    this.addUserLeftCallback = function(callback) {
        this.processAddCallback(userleftCallbacks, callback);
    }

    var listenUserOnlineCallbacks = [];
    this.addListenUserOnlineCallback = function(callback) {
        this.processAddCallback(listenUserOnlineCallbacks, callback);
    }

    var updateMessageCallbacks = [];
    this.onUpdateMessage = function(callback) {
        this.processAddCallback(updateMessageCallbacks, callback);
    }

    var readyCallbacks = [];
    this.onReady = function(callback) {
        console.log('callback ready');
        console.log(readyCallbacks);
        this.processAddCallback(readyCallbacks, callback);
    }

    this.ready = function(data) {
        this.processCallback(readyCallbacks);
    }

    var that = this;

    this.createUsername = function(user) {
        return "user" + user.id;
    }

    this.socketLogin = function() {
        console.log('try to login socket...');
        if (viewer && viewer.full_name) {
            socket.username = this.createUsername(viewer);
            var image = viewer.images.normal.url;
            socket.image = image;
            console.log("socketLogin: full name: " + viewer.full_name + ", username: " + socket.username);
            var sendData = {
                username: socket.username,
                image: image,
                user_id: viewer.id,
                fullname: viewer.full_name
            };

            socket.user = sendData;

            socket.emit('user login', sendData);
        } else {
            console.log('user is not login, please login to continue...');
            $timeout(function() {
                that.socketLogin();
            }, 1000);
        }
    }

    this.onLogin = function(data) {
        isLoginProcessing = false;

        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        console.log(message);
        console.log(data);
        if (data.users) {
            that.listenUserOnline(data.users);
        }
        bSocketReady = true;
        that.ready(data);
    }

    this.listenEvents = function() {
        socket.on('login', function(data) {
            console.log('login success');
            that.onLogin(data);
        });

        // Whenever the server emits 'new message', update the chat body
        socket.on('new message', function(data) {
            console.log('new message');
            console.log(data);
            that.addNewMessage(data);
        });

        // Whenever the server emits 'user joined', log it in the chat body
        socket.on('user joined', function(data) {
            that.userJoin(data);
        });

        // Whenever the server emits 'user left', log it in the chat body
        socket.on('user left', function(data) {
            that.userLeft(data);
        });

        // Whenever the server emits 'typing', show the typing message
        socket.on('typing', function(data) {
            that.typing(data);
        });

        // Whenever the server emits 'stop typing', kill the typing message
        socket.on('stop typing', function(data) {
            that.stopTyping(data);
        });

        socket.on('talk', function(data) {
            console.log('talk');
            console.log(data);
            that.talk(data);
        });

        // listen request room
        socket.on('request room', function(room, user) {
            console.log(user.username + " request chat with you in room " + room);
            that.addUser(user.username, user);
            socket.emit('join room', room);
        });

        socket.on('get user online', function(data) {
            console.log('get user online success');
            that.listenUserOnline(data);
        });

        socket.on('disconnect', function(data) {
            console.log('disconnect');
            console.log(data);
        });
    }
    this.init = function() {

        if (!bSocketReady) {
            if (isLoginProcessing) {
                return;
            }
            isLoginProcessing = true;
            if (!socket) {
                socket = io('http://192.168.1.5:3000');

                $timeout(function() {
                    that.socketLogin();
                    that.listenEvents();
                }, 100);
            } else {
                that.socketLogin();
            }

        } else {
            console.log('ready');
            that.ready({
                users: users
            });
        }
    }

    this.getUsername = function() {
        return (socket.username || '');
    }

    this.getImage = function() {
        return (socket.image || '');
    }

    this.typing = function(data) {

    }

    this.stopTyping = function(data) {

    }

    this.processCallback = function(callbacks, data) {
        if (callbacks && callbacks.length) {
            for (var i = 0; i < callbacks.length; i++) {
                var callback = callbacks[i];
                callback(data);
            }
        }
    }

    this.addNewMessage = function(data) {
        this.processCallback(newMessageCallBacks, data);
    }

    this.userLeft = function(data) {
        console.log('addUserLeftCallback');
        console.log(data);
        if (data.username) {
            if (typeof users[data.username] !== 'undefined') {
                users[data.username].online = false;
            }
        }
        totalUser = data.numUsers;
        this.processCallback(userleftCallbacks, data);
    }

    this.addProcessingMessage = function(username, message) {
        if (!username || !message || !message.key) {
            console.log('can not add null message to processingMessages');
            return;
        }
        var user = this.getUser(username);
        if (user) {
            user.processingMessages[message.key] = message;
        } else {
            console.log('can not add a processing message to null user');
        }
    }

    this.removeProcessingMessage = function(username, key) {
        if (!username) {
            console.log('removeProcessingMessage: username is null');
            return;
        }
        if (!key) {
            return console.log('removeProcessingMessage: key is null');
        }
        var user = this.getUser(username);
        if (user) {
            if (typeof user.processingMessages[key] !== 'undefined') {
                delete user.processingMessages[key];
            } else {
                console.log('removeProcessingMessage: message not exist');
            }
        } else {
            console.log('removeProcessingMessage: user is null');
        }
    }

    this.getProcessingMessage = function(username, key) {
        if (!username) {
            console.log('getProcessingMessage: username is null');
            return;
        }
        if (!key) {
            return console.log('getProcessingMessage: key is null');
        }
        var user = this.getUser(username);
        if (user) {
            if (typeof user.processingMessages[key] !== 'undefined') {
                return user.processingMessages[key];
            } else {
                console.log('getProcessingMessage: message not exist');
            }
        } else {
            console.log('getProcessingMessage: user is null');
        }
    }

    this.addUser = function(username, user) {
        if (username == this.getUsername()) {
            return null;
        }
        if (typeof users[username] !== 'undefined') {
            user = users[username];
            user.online = true;
        } else {
            user.online = true;
            user.messages = [];
            user.processingMessages = {};
            users[username] = user;
        }
        this.processCallback(userJoinCallbacks, {
            username: username
        });

        return user;
    }

    this.userJoin = function(data) {
        console.log('userJoin');
        console.log(data);
        var user = data.user;
        if (user.username) {
            this.addUser(user.username, user);
        }
        totalUser = data.numUsers;
    }

    this.addMessage = function(username, data) {
        if (!data || !username) {
            return;
        }

        var user = null;
        if (data.is_update) {
            console.log('addMessage: check is_update: ' + data.is_update);
            var message = this.getProcessingMessage(username, data.key);
            if (message) {
                // todo update message and remove processing message
                $.extend(message, data);
                this.removeProcessingMessage(username, data.key);
                console.log('update message');
                console.log(message);
                if (message.is_processing) {
                    delete message.is_processing;
                }
                that.processCallback(updateMessageCallbacks, message);
                return;
            }
        }
        if (typeof users[username] !== 'undefined') {
            user = users[username];
            user.messages.push(data);
        } else {
            user = this.addUser(username, {
                username: username,
                image: data.image,
                user_id: data.id,
                fullname: data.fullname
            });
            if (user) {
                user.messages.push(data);
            }
        }
        if (data.is_processing) {
            this.addProcessingMessage(username, data);
        }
    }

    this.talk = function(data) {
        if (!data || !data.username) {
            return;
        }
        console.log('this talk');
        console.log(data);
        if (!data.image) {
            var user = this.getUser(data.username);
            if (user && user.image) {
                data.image = user.image;
            }
        }
        this.addMessage(data.username, data);
        this.processCallback(talkCallbacks, data);
    }

    this.startChat = function(username) {
        socket.emit('request room', username);
    }

    this.getUser = function(username) {
        if (typeof users[username] !== 'undefined') {
            return users[username];
        } else {
            return false;
        }
    }

    this.sendMessage = function(message, params) {
        if (!message) {
            return false;
        }
        console.log('sendMessage');
        console.log(message);
        message.senderImage = this.getImage();
        message.senderUsername = this.getUsername();
        message.bMine = true;
        message.key = key;
        var tmMessage = message.message;
        if (!message.is_processing) {
            message.is_complete = true;
        }

        this.addMessage(message.receiveUsername, message);
        var sendData = {
            username: message.getReceiveUsername(),
            message: tmMessage,
            key: key
        };
        socket.emit('talk to user', message);
    }

    this.listenUserOnline = function(data) {
        console.log('listenUserOnline');
        console.log(data);
        if (!data) {
            return;
        }
        $.each(data, function(username, user) {
            var newUser = that.addUser(username, user);
            if (newUser && user.online_time) {
                newUser.online_time = user.online_time;
            }
        });
        this.processCallback(listenUserOnlineCallbacks, users);
    }

    this.getUserOnlineFromServer = function() {
        console.log('getUserOnlineFromServer');
        socket.emit('get user online');
    }
}

var SChat = function() {
    var TAG = 'SChat';
    var _id = new Date().getTime();

    this.getIdentity = function() {
        return _id++;
    }

    this.getMessage = function(username) {
        if (users.containsKey(username)) {
            var user = getUser(username);
            return user.getMessages();
        }
        return null;
    }

    this.generalRoomId = function(from, to) {
        if (from > to) {
            return (to + "_" + from);
        }
        return (from + "_" + to);
    }

    this.generalRoomBetweenTwoUser = function(from, to) {
        return this.generalRoomId("user" + from.getId() + "_" + "user" + to.getId());
    }

    var socket = null;
    this.getSocket = function() {
        return socket;
    }
    var viewer;
    var mine;

    this.getMine = function() {
        return mine;
    }

    var users = new DObject();
    var totalUser = 0;
    var bSocketReady = false;
    var isLoginProcessing = false;
    var username;
    var image;
    var IO;
    this.setIO = function(IOSocket) {
        IO = IOSocket;
    }

    var $viewer;
    this.setUserService = function(service) {
        $viewer = service;
    }

    var $dhttp;
    this.setHttpService = function(service) {
        $dhttp = service;
    }

    var that = this;
    this.getImage = function() {
        return image;
    }

    this.getCurrentViewer = function() {
        console.log(TAG + ": getCurrentViewer");
        viewer = $viewer.get();
        console.log(viewer);
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

    this.processRemoveCallback = function(callbacks, callback) {
        if (!callback) {
            return;
        }
        var index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    this.getUsers = function() {
        return users;
    }

    var newMessageCallBacks = [];
    this.addNewMessageCallBack = function(callback) {
        this.processAddCallback(newMessageCallBacks, callback);
    }

    var saveMessageCallBacks = [];
    this.onSavedMessageSuccess = function(callback) {
        this.processAddCallback(saveMessageCallBacks, callback);
    }

    var userJoinCallbacks = [];
    this.addUserJoinCallbacks = function(callback) {
        this.processAddCallback(userJoinCallbacks, callback);
    }

    var talkCallbacks = [];
    this.onNewMessageListener = function(callback) {
        this.processAddCallback(talkCallbacks, callback);
    }

    this.removeOnNewMessageListener = function(callback) {
        this.processRemoveCallback(talkCallbacks, callback);
    }

    var userLeftCallbacks = [];
    this.addUserLeftCallback = function(callback) {
        this.processAddCallback(userLeftCallbacks, callback);
    }

    var listenUserOnlineCallbacks = [];
    this.addListenUserOnlineCallback = function(callback) {
        this.processAddCallback(listenUserOnlineCallbacks, callback);
    }

    var updateMessageCallbacks = [];

    this.onUpdateMessage = function(callback) {
        this.processAddCallback(updateMessageCallbacks, callback);
    }

    this.removeOnUpdateMessageListener = function(callback) {
        this.processRemoveCallback(updateMessageCallbacks, callback);
    }

    var readyCallbacks = [];
    this.onReady = function(callback) {
        this.processAddCallback(readyCallbacks, callback);
    }

    this.removeOnReadyListener = function(callback) {
        this.processRemoveCallback(readyCallbacks, callback);
    }

    this.ready = function(data) {
        this.processCallback(readyCallbacks, data);
    }

    this.emit = function(event, message) {
        if (!socket) {
            return;
        }
        socket.emit(event, message);
    }

    this.createUsername = function(user) {
        return "user-" + user.id;
    }

    this.socketLogin = function() {
        console.log(TAG + ":try to login socket...");
        if (viewer) {
            username = that.createUsername(viewer);
            image = viewer.images.normal.url;
            mine = new ChatUser();
            mine.username = username;
            mine.fullname = viewer.full_name;
            mine.id = viewer.id;
            mine.image = image;
            console.log(TAG + ":socketLogin: full name: " + viewer.full_name + ", username: " + username);

            var sendData = new JSONObject();
            sendData.put("username", username);
            sendData.put("image", image);
            sendData.put("user_id", viewer.id);
            sendData.put("fullname", viewer.full_name);

            socket.emit("user login", sendData);
        } else {
            that.getCurrentViewer();
            console.log(TAG + ":user is not login, try login...");
            console.log(viewer);
            setTimeout(function() {
                that.socketLogin();
            }, 2000);
        }
    }

    this.onLogin = function(data) {
        isLoginProcessing = false;

        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        console.log(TAG + ":" + message);
        that.listenUserOnline(data.users);
        bSocketReady = true;
        this.ready(data);
    }

    this.listenEvents = function() {
        console.log(TAG + ":listenEvents");
        socket.on("login", function(data) {
            data = dObject(data);
            console.log(TAG + ":socket chat login success");
            console.log(data);
            that.onLogin(data);
        });

        // Whenever the server emits "new message", update the chat body
        socket.on("new message", function(data) {
            console.log(TAG + ":new message");
            that.addNewMessage(data);
        });

        // Whenever the server emits "user joined", log it in the chat body
        socket.on("user joined", function(data) {
            DMobi.log(TAG, "user joined");
            console.log(data);
            DMobi.log(TAG, "-- user joined --");
            data = dObject(data);
            var user = dObject(data.user);
            that.userJoin(user);
        });

        // Whenever the server emits "user left", log it in the chat body
        socket.on("user left", function(data) {
            data = dObject(data);
            that.userLeft(data);
        });

        // Whenever the server emits "typing", show the typing message
        socket.on("typing", function(data) {
            that.typing(data);
        });

        // Whenever the server emits "stop typing", kill the typing message
        socket.on("stop typing", function(data) {
            that.stopTyping(data);
        });
        DMobi.log(TAG, "listenEvents: talk");
        socket.on("talk", function(data) {
            console.log(TAG + ":talk");
            data = dObject(data);
            that.talk(data);
        });

        // listen request room
        socket.on("request room", function(room, user) {
            DMobi.log(TAG, "request room: " + room);
            console.log(user);
            tmUsername = user.username;
            tmImage = user.image;
            console.log(TAG + ':' + tmUsername + " request chat with you in room " + room);
            that.addUser(tmUsername, tmImage);
            socket.emit("join room", room);
        });
        socket.on("get user online", function(data) {
            console.log(TAG + ":get user online success");
            that.listenUserOnline(data);
        });

        socket.on("test", function(data) {
            console.log('test');
            console.log(data);
        });

        socket.on("my message", function(msg) {
            DMobi.log(TAG, "my messages: " + msg);
        });
    }

    this.init = function() {
        if (!bSocketReady) {
            if (isLoginProcessing) {
                return;
            }
            that.getCurrentViewer();
            isLoginProcessing = true;
            if (!socket) {
                socket = IO('http://192.168.1.5:3000');
                // socket.connect();
                setTimeout(function() {
                    that.socketLogin();
                    that.listenEvents();
                }, 200);
            } else {
                // that.socketLogin();
            }

        } else {
            console.log(TAG + ":ready");
            that.ready(users);
        }
    }

    this.getUsername = function() {
        return username;
    }

    this.typing = function(data) {

    }

    this.stopTyping = function(data) {

    }

    var processCallback = this.processCallback = function(callbacks, data) {
        if (callbacks && callbacks.length) {
            for (var i = 0; i < callbacks.length; i++) {
                var callback = callbacks[i];
                callback(data);
            }
        }
    }

    this.addNewMessage = function(data) {
        that.processCallback(newMessageCallBacks, data);
    }

    this.userLeft = function(data) {
        DMobi.log(TAG, ":addUserLeftCallback");
        var tmUsername = data.getString("username");
        DMobi.log(TAG, "userLeft: username " + tmUsername);
        if (tmUsername) {
            if (users.containsKey(tmUsername)) {
                var user = users.get(tmUsername);
                if (user) {
                    user.online = false;
                    that.processCallback(userLeftCallbacks, user);
                }
            }
        }
        totalUser = data.getInt("numUsers");
    }

    // params data is object include user information 
    this.addUser = function(username, data) {
        if (!username) {
            return null;
        }
        if (username.equals(this.getUsername())) {
            return null;
        }
        var user;

        if (users.containsKey(username)) {
            user = users.get(username);
            // todo update data if user is process
            // user is processing only user is not in list and updated later
            if (user.is_processing) {
                $.extend(user, data);
            }
            user.online = true;
        } else {
            user = new ChatUser();
            $.extend(user, data);
            user.username = username;
            user.online = true;

            users.put(username, user);
        }

        that.processCallback(userJoinCallbacks, user);

        return user;
    }

    this.userJoin = function(data) {
        console.log(TAG + ":userJoin");
        var tmUsername = data.getString("username");
        var tmImage = data.getString("image");
        DMobi.log(TAG, "userJoin: add user " + tmUsername);
        if (tmUsername) {
            DMobi.log(TAG, "userJoin: begin add user");
            that.addUser(tmUsername, data);
        }
        totalUser = data.getInt("numUsers");
    }

    // params data is ChatMessage
    this.addMessage = function(username, data) {
        if (!username || !data) {
            console.log(TAG + ":addMessage: username or data is null");
            return;
        }
        var user = this.getUser(username);
        if (data.is_update) {
            console.log(TAG + ":addMessage: check is_update message: " + data.getSenderKey());
            var message = user.getProcessingMessage(data.getSenderKey());
            if (message) {
                console.log(TAG + ":addMessage: update message");
                // todo update message and remove processing message
                // todo merge two  data to message
                message.merge(data);
                user.removeProcessingMessage(data.getSenderKey());
                console.log(TAG + ":update message");
                if (message.is_processing) {
                    message.is_processing = false;
                }
                processCallback(updateMessageCallbacks, message);
                return;
            }
        }
        if (users.containsKey(username)) {
            user = users.get(username);
        } else {
            user = that.addUser(username, data.senderImage);
        }
        // todo add user
        if (data.bMine) {
            data.user = viewer;
            data.sender = this.getMine();
            data.receiver = user;
        } else {
            data.user = viewer;
            data.receiver = this.getMine();
            data.sender = user;
        }
        if (user) {
            user.messages.add(data);
        }
        if (data.is_processing) {
            console.log(TAG + ":addMessage: check is processing message sender key: " + data.getSenderKey());
            user.addProcessingMessage(data);
        }
        that.processCallback(talkCallbacks, data);
    }

    // params data is object
    this.talk = function(data) {
        DMobi.log(TAG, "talk listener");
        tmUsername = data.username;
        tmImage = data.image;
        if (!tmUsername) {
            return;
        }

        var chatMessage = new ChatMessage();
        chatMessage.cloneFromJSONObject(data);
        chatMessage.senderUsername = tmUsername;
        chatMessage.receiveUsername = this.getUsername();
        chatMessage.key = that.getIdentity();
        if (data.has("key")) {
            chatMessage.senderKey = data.getLong("key");
        }
        chatMessage.senderImage = tmImage;
        chatMessage.bMine = false;
        console.log(TAG + ":this talk: chatMessage: " + chatMessage.message + ", senderUsername:" + tmUsername);

        that.addMessage(tmUsername, chatMessage);
    }

    this.startChat = function(username) {
        DMobi.log(TAG, "startChat with username: " + username);
        socket.emit("request room", username);
    }

    this.getUser = function(username) {
        if (typeof users[username] !== 'undefined') {
            return users[username];
        } else {
            return null;
        }
    }

    this.sendMessage = function(data) {
        this.sendMessage(data, null);
    }

    // params ChatMessage message
    this.sendMessage = function(message, params) {
        if (message == null) {
            return null;
        }
        console.log(TAG + ":sendMessage");
        var key = that.getIdentity();
        message.senderImage = that.getImage();
        message.senderUsername = that.getUsername();
        message.bMine = true;
        message.key = key;
        var tmMessage = message.message;
        if (!message.is_processing) {
            message.is_complete = true;
        }
        that.addMessage(message.receiveUsername, message);

        var sendData = new JSONObject();
        sendData.put("username", message.getReceiveUsername());
        sendData.put("message", tmMessage);
        sendData.put("key", key);
        sendData.put("room_name", message.roomName);
        if (params) {
            $.extend(sendData, params);
        }
        DMobi.log(TAG, 'sendMessage ');
        console.log(sendData);
        socket.emit("talk to user", sendData);
        this.sendMessageToServer(message, sendData);
        return message;
    }

    this.sendMessageToServer = function(message) {
        if (!message) {
            return;
        }
        var sendData = {
            'room_name': message.roomName,
            'message': message.message
        };
        $dhttp.post('dchat.message.add', sendData).success(function(data) {
            DMobi.log(TAG, "sendMessageToServer: success");
            console.log(data);
            // todo: data include id of message just add to db
            message.id = data.data;
            // todo trigger onSaveMessage
            that.processCallback(saveMessageCallBacks, message);
        }).error(function(error) {
            console.log(error);
        });
    }

    this.updateMessage = function(message, params) {
        console.log(TAG + ":update message");
        if (!message) {
            return;
        }
        if (!message.key) {
            return;
        }
        var sendData = new JSONObject();
        sendData.put("username", message.getReceiveUsername());
        sendData.put("message", message.message);
        sendData.put("key", message.key);
        sendData.put("is_complete", message.is_complete);
        if (message.photo) {
            sendData.put("photo", message.photo);
        }
        sendData.put("is_update", true);
        if (params) {
            $.extend(sendData, params);
        }
        if (message.photo) {
            this.attachPhotoToMessage(message);
        }
        DMobi.log(TAG, ":update message key " + message.getKey() + ", username: " + message.getReceiveUsername());
        socket.emit("talk to user", sendData);
    }

    this.attachPhotoToMessage = function(message) {
        if (!message) {
            return;
        }
        var sendData = {
            'message_id': message.getId(),
            'attachment_type': 'photo',
            'attachment_id': message.photo_id
        };
        $dhttp.post('dchat.message.update', sendData).success(function(data) {
            DMobi.log(TAG, "attachPhotoToMessage: success");
            console.log(data);
            // todo: data include id of message just add to db
        }).error(function(error) {
            console.log(error);
        });
    }

    this.listenUserOnline = function(data) {
        console.log(TAG + ":listenUserOnline");
        if (!data) {
            return;
        }

        $.each(data, function(key, user) {
            var chatUser = that.addUser(user.username, user);
        });
        console.log(data);
        this.processCallback(listenUserOnlineCallbacks, users);
    }

    this.getUserOnlineFromServer = function() {
        console.log(TAG + ":getUserOnlineFromServer");
        socket.emit("get user online");
    }


}

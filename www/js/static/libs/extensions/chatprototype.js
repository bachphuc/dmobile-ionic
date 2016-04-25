// todo declare JSONObject
var JSONObject = function() {
    this.put = function(key, value) {
        this[key] = value;
    }
}

var DObject = function() {

}

var DMobi = {
    log: function(tag, message) {
        console.log(tag + ": " + message);
    }
}

DObject.prototype.has = function(key) {
    return this.hasOwnProperty(key);
}

DObject.prototype.get = function(key) {
    return (this[key] ? this[key] : false);
}

DObject.prototype.put = function(key, value) {
    this[key] = value;
}
DObject.prototype.getLong = function(key) {
    return this.get(key);
}

DObject.prototype.getString = function(key) {
    return this.get(key);
}

DObject.prototype.getInt = function(key) {
    return this.get(key);
}

DObject.prototype.containsKey = function(key) {
    return this.hasOwnProperty(key);
}

String.prototype.equals = function(str) {
    return (this == str ? true : false);
}

Array.prototype.put = function(item) {
    this.push(item);
}

Array.prototype.add = function(item) {
    this.push(item);
}

Array.prototype.appendAll = function(items) {
    Array.prototype.push.apply(this, items);
}

Array.prototype.prependAll = function(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        this.splice(0, 0, items[i]);
    }
}

function dObject(o) {
    var obj = new DObject();
    $.extend(obj, o);
    return obj;
}


// todo declare ChatMessage Class
var ChatMessage = function() {
    this.key;

    this.getKey = function() {
        return this.key;
    }

    this.senderKey;

    this.getSenderKey = function() {
        return this.senderKey;
    }

    this.id;
    this.getId = function() {
        return this.id;
    }
    this.message;
    this.sender;
    this.receiver;
    this.user;
    this.senderUsername;
    this.is_complete = false;
    this.is_update = false;
    this.is_processing = false;
    this.attachment_type;

    this.getSenderUsername = function() {
        return this.senderUsername;
    }

    this.receiveUsername;

    this.getReceiveUsername = function() {
        return this.receiveUsername;
    }

    this.senderImage;

    this.getSenderImage = function() {
        return this.senderImage;
    }

    this.photo;
    this.bMine = false;

    this.isMine = function() {
        return this.bMine;
    }

    this.getTitle = function() {
        return this.senderUsername;
    }

    this.getMessage = function() {
        return this.message;
    }

    this.merge = function(chatMessage) {
        this.photo = chatMessage.photo;
        this.is_update = chatMessage.is_update;
        this.is_complete = chatMessage.is_complete;
        this.message = chatMessage.message;
        this.is_processing = chatMessage.is_processing;
        this.attachment_type = chatMessage.attachment_type;
    }

    this.cloneFromJSONObject = function(data) {
        if (data.message) {
            this.message = data.message;
        }
        if (data.is_processing) {
            this.is_processing = data.is_processing;
        }
        if (data.is_update) {
            this.is_update = data.is_update;
        }
        if (data.is_complete) {
            this.is_complete = data.is_complete;
        }
        if (data.photo) {
            this.photo = data.photo;
        }
        if (data.attachment_type) {
            this.attachment_type = data.attachment_type;
        }
    }
}

// todo declare ChatUser Class
var ChatUser = function() {
    var TAG = 'ChatUser';
    this.online_time;
    this.online;
    this.username;
    this.image;
    this.fullname;
    this.is_processing;
    this.maxFeedId = 0;

    this.id;
    this.getId = function() {
        return this.id;
    }

    this.getTitle = function() {
        return this.fullname;
    }

    this.getUsername = function() {
        return this.username;
    }

    this.getImage = function() {
        return this.image;
    }

    this.messages = [];
    this.processingMessages = {};

    this.addProcessingMessage = function(message) {
        console.log(TAG + ":addProcessingMessage to user " + this.username);
        var key = message.bMine ? message.getKey() : message.getSenderKey();
        this.processingMessages[key] = message;
    }

    this.removeProcessingMessage = function(key) {
        if (typeof this.processingMessages[key] !== 'undefined') {
            delete this.processingMessages[key];
        }
    }

    this.getProcessingMessage = function(key) {
        console.log(TAG + ":getProcessingMessage from user " + this.username);
        if (typeof this.processingMessages[key] === 'undefined') {
            console.log(TAG + ":getProcessingMessage: no message processing");
            return false;
        }
        return this.processingMessages[key];
    }

    this.getMessages = function() {
        return this.messages;
    }

    this.loadOlderMessages = function() {

    }
}

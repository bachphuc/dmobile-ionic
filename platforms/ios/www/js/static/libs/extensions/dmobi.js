define([], function() {
    var DmobiObject = function() {
    	this.identityId = 0;
    }

    DmobiObject.prototype.getIdentityId = function(){
    	this.identityId++;
    	return this.identityId;
    }

    DmobiObject.prototype.showToast = function(str) {
    	var ele = $('<div/>').addClass('dmobi_toast').html('<span>'+ str +'</span>');
    	$('body').append(ele);
    	ele.fadeIn();
		setTimeout(function(){ele.fadeOut();}, 2000);
    }

    Dmobi = new DmobiObject();
    console.log('Declara Dmobi Object');
    console.log(Dmobi);
    return Dmobi;
});

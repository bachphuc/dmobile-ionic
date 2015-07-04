define([], function() {
	var ExtendScope = function(){
		this.data = [];
	}

	ExtendScope.prototype.test = function(){
		alert('chan vat va');
	}

	ExtendScope.prototype.example = function(){
		for(var i = 0 ; i < 100; i++){
			this.data.push(i);
		}
	}

	ExtendScope.prototype.getNavViewContent = function(){
		if(typeof this.controllers === 'undefined'){
			return '';
		}
		var sHtml = '<ion-nav-view name="menuContent" class="nav-page" id="menuContent"></ion-nav-view>';
		if(this.controllers.length){
			for(var i = 0; i< this.controllers.length; i++){
				sHtml+= '<ion-nav-view name="menuContent-' + this.controllers[i] + '" class="nav-page" id="menuContent-' + this.controllers[i] + '"></ion-nav-view>';
			}
		}
		return sHtml;
	}

	ExtendScope.prototype.getUser = function(){
		if(localStorage.getItem('token')){
            this.isUser = true;
            this.user = JSON.parse(localStorage.getItem('user'));
        }
	}

	ExtendScope.prototype.setModel = function(data, model){
		var newData = data.map(function(item) {
            return $.extend({}, model, item);
        });
        return newData;
	}

	return new ExtendScope();
});
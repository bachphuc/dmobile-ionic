define([], function(){
	return {
		getItemContent : function(){
			if(typeof this.item === 'undefined'){
				return '';
			}
			if(typeof this.item.type_item === 'undefined'){
				return '';
			}
			var sModule = this.item.type_item.replace('_','');
			return '<'+sModule+'-feed-item-dir obj="item"></' + sModule + '-feed-item-dir>';
		}
	}
});
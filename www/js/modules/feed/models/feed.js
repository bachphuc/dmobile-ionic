define([], function(){
	return {
		getItemContent : function(){
			if(typeof this.item === 'undefined'){
				return '';
			}
			if(typeof this.item.item_type === 'undefined'){
				return '';
			}
			var sModule = this.item.item_type.replace('_','');
			return '<'+sModule+'-feed-item-dir obj="item"></' + sModule + '-feed-item-dir>';
		}
	}
});
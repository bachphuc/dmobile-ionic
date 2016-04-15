define([], function(){
	return {
		getTitle : function(){
			return this.full_name || '';
		}
	}
});
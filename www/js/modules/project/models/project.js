define([], function(){
	return {
		getTitle : function(){
			return this.title || '';
		},
		getId : function(){
			return this.project_id || 0;
		}
	}
});
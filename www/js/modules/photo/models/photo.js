define([], function() {
    return {
        getTitle: function() {
            return this.title || '';
        },
        getDescription : function(){
        	return this.description || '';
        },
        getThumnailImage : function(){
        	return this.images.large.url || '';
        }
    }
});

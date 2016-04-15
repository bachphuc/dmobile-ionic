define([], function() {
    return {
        toggleCommentLike: function() {
            if (this.isLikeProcessing) {
                return;
            }
            this.isLikeProcessing = true;

            if (this.is_like) {
                this.total_like -= 1;
            } else {
                this.total_like += 1;
            }
            this.is_like = !this.is_like;
            var postData = {
                type_id: 'feed_mini',
                item_id: this.comment_id
            };

            var sApi = (this.is_like ? 'like.like' : 'like.removeLike');
            var dis = this;
            this.$dhttp.post(sApi, postData).success(function(data) {
                dis.isLikeProcessing = false;
                if (data.status) {
                    dis.total_like = data.data.total_like;
                    dis.is_like = data.data.is_like
                } else {
                    alert(data.errors.join('.'));
                }
            }).error(function(error) {
                dis.isLikeProcessing = false;
                alert('Can not get data from server.');
            });
        }
    }
});

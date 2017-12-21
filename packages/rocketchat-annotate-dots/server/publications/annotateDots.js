Meteor.publish('annotateDots', function(rid, fid) {
	if (!this.userId) {
		return this.ready();
	}
	const publication = this;

	const user = RocketChat.models.Users.findOneById(this.userId);
	if (!user) {
		return this.ready();
	}
	const cursorHandle = RocketChat.models.Messages.getAnnotatedMessageByFileAndRoom(rid, fid).observeChanges({
		added(_id, record) {
      console.log('result ===>',record);
			return record.annotation.forEach(item=>{
				publication.added('rocketchat_dots', item._id, item);
			})
		},
		changed(_id, record) {
			return record.annotation.forEach(item=>{
				publication.changed('rocketchat_dots', item._id, item);
			})
		},
		removed(_id) {
			return record.annotation.forEach(item=>{
				publication.removed('rocketchat_dots', item._id);
			})
		}
	});
	this.ready();
	return this.onStop(function() {
		return cursorHandle.stop();
	});
});

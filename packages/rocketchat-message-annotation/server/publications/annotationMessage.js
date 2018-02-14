Meteor.publish('annotationMessage', function(rid, limit = 50) {
	if (!this.userId) {
		return this.ready();
	}
	const publication = this;

	const user = RocketChat.models.Users.findOneById(this.userId);
	if (!user) {
		return this.ready();
	}
	const cursorHandle = RocketChat.models.Messages.findAnnotatedByRoom(rid, { sort: { ts: -1 }, limit }).observeChanges({
		added(_id, record) {
			record.annotation.forEach(item=>{
				publication.added('rocketchat_annotation_message', item._id, item);
			})
		},
		changed(_id, record) {
			record.annotation.forEach(item=>{
				publication.changed('rocketchat_annotation_message', item._id, item);
			})
		},
		removed(_id) {
			record.annotation.forEach(item=>{
				publication.removed('rocketchat_annotation_message', item._id);
			})
		}
	});
	this.ready();
	return this.onStop(function() {
		return cursorHandle.stop();
	});
});

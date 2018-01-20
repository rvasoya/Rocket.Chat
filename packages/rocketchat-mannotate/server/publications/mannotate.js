Meteor.publish('mannotate', function(fileId) {
	if (!this.userId) {
		return this.ready();
	}
	const publication = this;

	const user = RocketChat.models.Users.findOneById(this.userId);
	if (!user) {
		return this.ready();
	}
	const cursorHandle = RocketChat.models.Messages.getAnnotatedMessageByFile(fileId).observeChanges({
		added(_id, record) {
			console.log('added',record.annotation.length);
      publication.added('annotation-dots', _id, record );
		},
		changed(_id, record) {
			console.log('changed',record.annotation.length);
      publication.added('annotation-dots', _id, record);
		},
		removed(_id) {
			console.log('removed');
      publication.removed('annotation-dots', _id);
		}
	});
  this.ready();
	return this.onStop(function() {
		return cursorHandle.stop();
	});
});
